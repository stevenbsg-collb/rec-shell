export const environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:8080/api/v1',
  },

  ia: {
    url: 'https://generativelanguage.googleapis.com/v1',
    //apiKey: 'AIzaSyD6Tm675FfOKRzMk0P_TBMSEVE_6X_S73U',
    model: 'gemini-2.5-flash',
  },

  youtube: {
    url: 'https://www.googleapis.com/youtube/v3/search',
    //apiKey: 'AIzaSyA3m56gu6RJJ9etf1HRiP3m9LK2XmIVjxA',
  },
  yolo : {
    url: 'http://localhost:8000'
  }
};
