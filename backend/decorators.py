from functools import wraps
from flask import session, redirect, url_for, jsonify, request, flash

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            if request.path.startswith('/api') or request.is_json:
                return jsonify({'error': 'Login required'}), 401
            flash('Log in is required to access this page!', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function