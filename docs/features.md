# Features

## User Account Authentication and Data Storage

User account authentication is used to ensure user data can be uniquely identified to an individual, saved, and synced across different devices.

### Architecture

:::tip Implementation Status
This feature has been implemented.
:::

![Authentication Workflow](../assets/authentication-workflow.svg)

We use a standard username/password scheme. When the user first accesses the site, they are redirected to the login page immediately if no valid session is found on the present device/browser. They may then register or login.

Authentication is done over HTTPS with the backend directly. We use cookie-based session management; upon successful login, the backend returns a cookie. We use a standard authentication framework on the backend, FastAPI Users, to assure that the authentication measures follow existing best practices and standards.

If the session is ever invalidated (e.g. session timeout or local data cleared including cookies), upon the next fetch from the backend server, the user will be temporarily redirected back to the login page. They will be redirected to the page they were viewing after logging back in successfully. This is done again in a very standard manner: the redirect location is stored as a URL parameter.


### Design Decisions

Server-side rendering is disabled for all pages; the webserver merely serves the application frontend, and the remaining logic is handled locally by the client. This includes authentication. No user data is ever flowed back to the server serving the frontend. This ensures that all communication happens only with the client and the backend, isolating the user's potentially sensitive data and minimises risk exposure.

![Authentication Sequence](../assets/authentication.svg)

### Challenges

We do not rely on all-in-one frameworks to handle authentication. As a result, while we can (and should) use authentication frameworks on the backend, much of the authentication is handled manually, especially on the frontend, which makes authentication a non-trivial feature in this project. During the implementation of authentication, numerous considerations were made to consider how user data should be handled and how authentication should take place via the frontend, including disabling server-side rendering, constraining fetching behaviour to only the client (no server-side fetch), handling valid sessions, ensuring synchronisation with the backend,

Implementing authentication in this manner required a deeper understanding of password- and cookie-based authentication, which required a considerable amount of time to setup on the frontend.

## User Data Syncing

User data is stored on the backend, identified uniquely to each user. Upon logging in, user data is populated directly from the server to sync user data across multiple devices.

### Architecture

User-specific data is stored on the server. When a user first logs in, their data is populated from the server locally and cached. Whenever a change is made to user data, the change is immediately propagated to both the backend and the local state.

The User data structure (used by the frontend) and API endpoints were designed to work in tandem. The backend database is strategically designed in line with RESTful API best practices to allow data to be selectively fetched and/or updated by the frontend.

![Class Diagram](../assets/class-diagram.svg)

:::warning TODO
Add database schema diagram here.
:::

## Views

EquiSight's frontend is organised into three tabs:

1. News Tab
2. Watchlist Tab
3. Analysis Tab

Each of these three tabs compartmentalises the distinct concerns of a retail investor when making decisions regarding their assets.

![Views](../assets/views.svg)

## News Querying (News View)

:::tip Implementation Status
This feature has been implemented.

Planned extension(s): 
- support other news aggregators or sources
:::

News querying is part of the news tab, the first tab of three, allowing users to customise queries for news articles from news aggregators.

![Screenshots](../assets/screenshots/news-views.png)

### Architecture

Presently, only one news aggregator is supported: _Yahoo! Finance_. The querying function allows users to perform targeted analysis.

They can customise:
- which tickers to retrieve articles for, and
- how many articles to query per article.

For convenience, the user can add, with a single button tap, all tickers currently in their watchlist. By default, all tickers in their watchlist are already included in the list to be queried. Should they wish to query only specific tickers (for example, if they want to decide whether or not to open a new position in them), they might then instead clear all tickers with another single tap. Users can add tickers individually to be queried.

Users can also change the number of articles they wish to query.

After the query is made, data is fetched via the backend. Furthermore, the last query is cached locally.

![News Query Workflow](../assets/news-workflow.svg)

### Design Decisions

This querying method was designed to adapt to different possible news aggregators. The intention behind querying instead of automatically loading or providing an infinite scroll is due to technical limitations and generality of such an interface. Different news aggregators will have different APIs and require different treatment, but they will all allow querying in some shape or form. Therefore, choosing to allow queries is the simplest abstraction affordable.

Users are not likely to want to always read news on the same set of tickers. They may want to only track a one or few tickers (perhaps due to recent activity), or want to investigate new potential assets. We thus give users the flexibility to choose which tickers they want to see.

We cap the total number of articles requested (no. of tickers * no. of articles per ticker) at 100. Querying can be expensive because it uses public APIs. Furthermore, it is unlikely that querying an excessive number of articles will help, since information about stocks can go out of date quickly. We give the user control over how much information they wish to see.

Queries are made per user and not cached on the server at all. This is because queries are likely to be different for each user, and also due to constraints set by the external APIs used for news aggregation. The most recent query is, however, cached locally on the user's device.

### Challenges

Major challenges were faced when designing this feature. Intially, the feature was envisioned to be very different from its present incarnation. We intended for this page to be similar to social media sites, showing an infinite scroll of relevant articles.

The problem comes with implementation feasibility. The aggregator we use does not allow us to easily query news articles about a ticker; we could only query a fixed number of articles about a single ticker, and the most recent articles on that ticker would be delivered. This meant that infinite loading would be infeasible, since we cannot query time ranges; every time we would want older articles, we would have to requery all newer articles too.

We pivoted to this feature implementation to essentially provide a compromise. The news aggregator only exposes an API, so it is useful for the user to use the frontend as a GUI for querying from the API directly. This achieves the goals wanted for this feature: to let users get up-to-date information about tickers of interest, especially when they wish to do targeted research before making a decision on a particular asset.

## Whole Portfolio (Watchlist View)

:::warning Implementation Status
This feature has been mostly implemented.

Incomplete subfeature(s):
- error handling for invalid tickers
- backend request pooling/caching
- currency conversions
:::

The user's entire portfolio is viewable from the watchlist view, letting them track their current portfolio's worth and see at a glance assets they are concerned with.

### Architecture

Users can manage a single watchlist. This watchlist is intended to be a a collection of the tickers in which they own equities in, and tickers they are interested in but do not hold an open position in which presently.

The user's entire portfolio's performance is also available at a glance, using prevailing foreign exchange rates.

Users can add or remove tickers directly to/from their watchlist from this page. When a ticker is first added, no open positions will be added for that ticker; the user may add open positions by clicking on the ticker itself to view the ticker's page. When data is refreshed, information for that ticker will be populated.

![Portfolio Workflow](../assets/portfolio-workflow.svg)

![Screenshots](../assets/screenshots/holdings-views.png)

The watchlist refreshes at set invervals, querying updated information from the backend. This gives the user live updates on tickers while their respective exchanges are live.

### Design Decisions

Refreshing is intentionally set a rather slow rate. Retail investors are generally speaking not interested in intraday stock movements, and are instead looking at medium to very long investment horizons. However, massive movements are still important to retail investors, so they do need to track tickers they are interested in. This compromise prevents us from having to overload external APIs to serve users.

We plan to also implement a caching strategy for livestreamed/frequently refreshed data to further pool requests from different users, reducing load on external APIs even more.

### Challenges

This page contained many moving parts; designing the page took significant prototyping to design how the data should be reloaded and how data should be fetched from the backend. Because not all data needs to be refreshed, the loading logic had to be designed to account for data that only had to be fetched once, and data that would have to be reloaded consistently, to prevent unnecessary fetching and slowdowns caused by said fetches.

## Ticker (Watchlist View)

:::warning Implementation
This feature has been mostly implemented.

Incomplete subfeature(s):
- intraday price history refresh
- modify open positions
- specify transaction timestamp for positions
- price history of different time periods
:::

The ticker page shows all of the essential information a retail investor needs to make sound decisions. This primarily includes historical price data and recent quarterly and annual reports.

![Ticker workflow](../assets/ticker-workflow.svg)

![Screenshots](../assets/screenshots/ticker-views.png)

### Architecture

The ticker page is split into several segments:
- Price History
- Holdings/Open Positions
- Financial Reports

A ticker's price history for various time periods is shown in a line chart. By default, the user is presented that ticker's intraday (1D period) price history. The line chart is interactive; the user may tap/hover over parts of the graph to view a tooltip that displays the price of that ticker at a particular timestamp.

The user can also edit their holdings for that particular ticker on this page. They can add and remove positions. Each position is intended to correspond to a single transaction made. The user is required to specify the direction (buy/sell), quantity, and unit cost, all of which can be retrieved from their broker.

![Screenshots](../assets/screenshots/ticker-views-holdings.png)

The backend is designed to expose endpoints that closely mirror the User data structure and editing operations on it. Actions on the frontend/changes made to user data have a one-to-one correspondence with backend API endpoints and methods.

### Design Decisions

Line charts can be easy to overcomplicate. A retail investor is less interested in precise intraday movements. Rather, they are more interested in general trends and peaks/troughs, which better display a stock's overall performance. The line chart is designed to highlight peaks and troughs; hovering over the line chart displays the nearest datapoint to the cursor location, making it more likely to snap to peaks and troughs. Aside from this, important data is always displayed: the minimum and maximum over the time period, and the start and end timestamps of the price history data.

### Challenges

By far the hardest subfeature to implement were line charts. Svelte is a relatively immature frontend framework and few framework-specific graphing libraries exist for Svelte, much less Svelte 5, the latest version of Svelte (which we use in this project). While a graphing library was used to save time implementing graphing from scratch, a signfiicant amount of time was spent learning the library and debugging, as the library used (Layerchart) was a young version recently ported to Svelte 5.

Yet another major challenge was data presentation. Optimising for retail investors' preferences and needs required significant thought, effort, and prototyping. The present incarnation of this feature is the one we eventually settled on, that balanced feasibility (of implementation) with usability.

This page is presently the most feature-dense page, with implementation complexity exceeding that of the previous view (holdings view, entire portfolio). It requires presenting many datasets in different manners, which itself requires significant consideration in picking the right representation. The complexity is further compounded by additional considerations surrounding external API usage, including data caching and user data fetching.