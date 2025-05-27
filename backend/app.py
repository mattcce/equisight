from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from models import db, User, PriceHistory
import yfinance as yf
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from decorators import login_required

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///equisight.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.before_request
def create_tables():
    db.create_all()


# Home Page
@app.route('/')
def home():
    return render_template('home.html')

# User login routes
@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error='Invalid credentials!')
    
    return render_template('login.html')

@app.route('/register', methods = ['POST'])
def register():
    username = request.form['username']
    password = request.form['password']

    if User.query.filter_by(username=username).first():
        return render_template('login.html', error='Username already exists')
    
    hashed_password = generate_password_hash(password)
    user = User(username=username, password=hashed_password)

    db.session.add(user)
    db.session.commit()

    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    return "Dashboard Placeholder"

@app.route('/ticker', methods=['GET','POST'])
@login_required
def ticker_search():
    if request.method == 'POST':
        ticker_symbol = request.form['ticker'].strip().upper()
        if ticker_symbol:
            return redirect(url_for('ticker_landing_page', ticker=ticker_symbol))
        else:
            flash('Please enter valid ticker', 'error')
    
    return render_template('ticker_search.html')


# Ticker and price history routes
@app.route('/ticker/<ticker>/history/')
@login_required
def ticker_history(ticker):
    ticker = ticker.upper()

    # Check last date in db
    last_entry = PriceHistory.query.filter_by(ticker=ticker).order_by(PriceHistory.date.desc()).first()

    current_date = date.today()

    if last_entry is None:
        try:
            stock = yf.Ticker(ticker)
            hist_data = stock.history(period="1y")

            for date_idx, row in hist_data.iterrows():
                price_entry = PriceHistory(
                    ticker=ticker.upper(),
                    date=date_idx.date(),
                    close=row['Close'],
                    volume=row['Volume']
                )
                db.session.add(price_entry)
            db.session.commit()

        except Exception as e:
            return jsonify({'error': f'Failed to fetch data for {ticker}'}), 404
    
    elif last_entry.date < current_date:
        try:
            stock = yf.Ticker(ticker)
            start_date = last_entry.date
            hist_data = stock.history(start=start_date, end=current_date)

            for date_idx, row in hist_data.iterrows():
                entry_date = date_idx.date()
                if entry_date > last_entry.date:
                    price_entry = PriceHistory(
                        ticker=ticker,
                        date=entry_date,
                        close=row['Close'],
                        volume=row['Volume']
                    )
                    db.session.add(price_entry)
            
            db.session.commit()
        
        except Exception as e:
            return jsonify({'error': f'Failed to update data for {ticker}'}), 404
    
    history = PriceHistory.query.filter_by(ticker=ticker).order_by(PriceHistory.date.desc()).all()    
    return jsonify([h.to_dict() for h in history])

@app.route('/ticker/<ticker>')
@login_required
def ticker_landing_page(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return jsonify({
            'symbol': ticker.upper(),
            'name': info.get('longName', 'N/A'),
            'price': info.get('currentPrice', 'N/A'),
            'market_cap': info.get('marketCap', 'N/A')
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch info for {ticker}'}), 404


# !!! FOR TESTING
@app.route('/reset-db')
def reset_database():
    db.drop_all()
    db.create_all()
    return jsonify({'message': 'Database reset.'})

if __name__ == '__main__':
    app.run(debug=True)
    