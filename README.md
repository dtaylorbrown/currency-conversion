# currency-conversion

A basic currency coversion app

## Set up
CURRENCY_BEACON_API_KEY is needed

## Run application
npm/yarn/pnpm dev

### Developer notes
I have quickly scaffolded this with nextjs, one for quickness in setup and two to make use of nextjs' server side functionality allowing us to fetch the initial currency list on the server when the app loads. This also allows us to cache the initial list to prevent unneccessary calls to the api on page refresh. 

I could have kept going on the design/layout but have kept it simple. We could add a swap currency button, include more details in the previous conversions, include currency symbols. These are returned from the initial api, I have just chosen not to include it for time. We could make use of the `prefers-color-scheme` media query to have a dark / light mode. This could also be a toggle, the list goes on... 

I've added a few simple tests focussing on user behaviour using react-testing-library just as an example, these would obviously be extended to include component tests for the `CurrencySelect` component. We could also make use of react-testing-librarys `renderHook` to test any custom hooks like we currently only have `usePreviousConversions` which is currently untested, but would to cover our bases. We could also use mock service worker to test the api calls. This would intercept the request to prevent us from calling the real currency api during testing.
