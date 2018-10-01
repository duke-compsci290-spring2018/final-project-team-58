# Final Project


### Alina Walling (agw24)

* **Date Started:** Spring 2018 Semester
* **Date Completed:** Fall 2018 Semester
* **Hours Spent:** A lot, don't have a precise estimate


---

## Resources

**Students Involved:** NONE

**Resources Used:**
1. [W3Schools HTML Tutorials](https://www.w3schools.com/html/default.asp)
2. [W3Schools CSS Tutorials](https://www.w3schools.com/css/default.asp)
3. [W3Schools JavaScript Tutorials](https://www.w3schools.com/js/default.asp)
4. [MDN Web Docs](https://developer.mozilla.org/en-US/)
5. [Vue.js Docs](https://vuejs.org)
6. [Firebase Web Docs](https://firebase.google.com/docs/database/web/start)
7. [Vuetify Docs](https://vuetifyjs.com/en/getting-started/quick-start)
8. [D3 Docs](https://github.com/d3/d3/wiki)
9. [Twitter Developers Docs](https://developer.twitter.com/en/docs/basics/getting-started)
10. [IBM Watson Tone Analyzer Docs](https://console.bluemix.net/docs/services/tone-analyzer/getting-started.html#gettingStarted)
11. [IBM Watson Tone Analyzer API](https://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/node.html?node)
12. [IBM Watson Personality Insights Docs](https://console.bluemix.net/docs/services/personality-insights/getting-started.html#gettingStarted)
13. [IBM Watson Personality Insights API](https://www.ibm.com/watson/developercloud/personality-insights/api/v3/node.html?node)
14. [Regex for a valid hashtag](https://stackoverflow.com/questions/42065872/regex-for-a-valid-hashtag)
15. [Sorting arrays in javascript by object key value](https://stackoverflow.com/questions/7889006/sorting-arrays-in-javascript-by-object-key-value)
16. [d3 gauge chart with labels and percentages?](https://stackoverflow.com/questions/44164912/d3-gauge-chart-with-labels-and-percentages)
    * Used as a starting point, but most of the code used for the tone charts created in D3 is my own.
17. [How To Capitalize The First Letter Of A String In JavaScript](https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript)


**Assets Used:**
1. Libraries Used
    * [Vue.js](https://vuejs.org)
    * [Vuetify](https://vuetifyjs.com/en/)
    * [Twitter Search API](https://developer.twitter.com/en/docs/tweets/search/overview/premium)
    * [Watson Node SDK](https://github.com/watson-developer-cloud/node-sdk)
    * [D3](https://d3js.org)
    * [Firebase](https://firebase.google.com/)
2. [Heroku](https://heroku.com)
3. [Material Design Icons](https://material.io/tools/icons/?style=baseline)
4. [FontAwesome Icons](https://fontawesome.com)
5. Professor Duvall's Examples
    * Node
    * REST
    * Mashup
6. [uiGradients Relay](https://uigradients.com/#Relay)


---

### Bugs

No known bugs to report.


---

### Extra Credit

No extra credit features to report.


---

## About the Project

#### What makes my application useful?
The world is filled with tension over current events, excitment over popular TV shows, strong opinions about a famous person, and many more emotions. Perhaps data that can help us to understand the emotions of others as we all uniquely experience these events can serve to foster more empathy and relieve tension. Truthfully, we could all use some more empathy. But where do we start?

The idea for my app was simple: I wanted to find out how Twitter users from all over the world feel about specific events or topics defined in Twitter hashtags. Thanks to IBM Watson's Tone Analyzer and Personality Insights, retrieving emotion and personality data about Twitter hashtags is easier than ever. With a simple idea and the tools to execute it, the magic of my app lies in the integration of 3 APIs to display a collective of data not otherwise possible to view side-by-side. Information about Tweets, tone, and personality is insightful separately, but together they can be life changing.

My app is useful because it streamlines the process of searching a Twitter hashtag, analyzing the tone and personality, and seeing the results. All of the hard work is done behind the scenes while the user sees beautiful graphs, a simple personality text summary, and some list of user preferences on their end. They can search multiple hashtags, save the results for later, and compare two separate results. Overall, it provides an interesting and easily accessible take on otherwise unnoticed emotional analysis of social media content we encounter every day.

In looking at the graphs of the tone analysis and personality characteristics, the user can apply their own story to the data they see and their knowledge of the hashtag. The user can engage in critical thinking about the world and its emotions, and may experience increased emotional self-awareness. Even if the functionality of the data is simple, the goal of increasing emotional awareness (and hopefully empathy) is accomplished. Often, striving for empathy is a difficult task for many people, but my app makes it not only manageable, but also a fun experience.

Whether you’re curious about how your opinions stack up against others about something silly or about something important, we have increasingly more technological tools to uncover and understand human emotions, and I used them in my application. I think many people would greatly benefit from easy access to these tools in my app, because it provides a new opportunity to build emotional intelligence. The more we can understand and empathize with one another, the better our world will be. So you could continue to struggle to understand human emotion on your own, or you could let my app understand them for you. All you have to do is choose a hashtag.


#### Special instructions need to set up, run, access, or use my application:
No special instructions are needed to get started with my app.


#### References for my data that establishes its authenticity:
* The Twitter Tweets data are retrieved using [Twitter's Premium Search API](https://developer.twitter.com/en/docs/tweets/search/overview/premium)
* The IBM Watson Tone Analyzer tone analysis data are retrieved using [IBM Watson's Tone Analyzer API]()
* The IBM Watson Personality Insights profile data are retrieved using [IBM Watson's Personality Insights API]()


#### How I chose my frameworks:
Truthfully, I didn't have many difficult decisions to make about what frameworks I would use for my app. I essentially needed to choose my front-end framework, style framework, and data visualization framework. In general, I liked to stick to what I know to make the development process focused on creating a good app rather than trying to learn something completely new in the process.

I chose to use **Vue.js** because I knew it well and it had the functionality I needed for my app. We learned it in class and I was comfortable using it; I didn't want to spend a lot of additional time trying to learn a new framework while building an entire app from scratch. I had to learn how to implement other features of my app, so I wanted to rely on Vue as something I knew how to use. My app heavily relies on displaying data rather than having extensive interactive features, so a reactive front-end framework like Vue was exactly what I needed to effectively display the data.

This is the same reason I used **Node.js**: I was comfortable with the framework. Additionally, all the services and frameworks integrated seamlessly with Node. IBM Watson has a Node SDK, the Node Request package was perfect for accessing Twitter APIs, D3 has a Node SDK, and the list goes on. I knew how to integrate it with Webpack and Vue.js and deploy the final app, making the development process easier overall.

I used **Vuetify** as my style framework for Vue.js, a migration from my previous preference for Bootstrap. Vuefity made it easy to integrate styles directly with Vue components. When using Bootstrap with the Quiz project, it was less intuitive using it within many layers of components. Since Vuetify uses Vue components as their style framework, it made using premade style components more seamless amongst my own components. Additionally, Vuetify has an incredible color, button, and other style library (WAY more options than Bootstrap!).

I chose to use **D3 JavaScript** for graphing the different charts for displaying the data. There are many data visualization JS libraries that are more automatic, preset, and require less work for the developer to put a diagram on the webpage (e.g. Chart.js). However, D3 offers much more flexibility in all respects: shapes, color schemes, types of data able to be displayed, etc. Since the beauty of my app is in the visualization of the data, I didn't want the visualizations to be boring. They needed to stand out, be fun to look at, and match the overall style of the website; identical bar charts weren't going to serve that purpose. Even though D3 requires much more work on my end to achieve the results I desired, I was able to create more fun ways to visualize the data, namely the circle bar charts for the personality traits.


---

### Additional Information

* The usability testing was performed with 3 different participants using a [Google Form](https://goo.gl/forms/aLjuLvO9yJmmpX1h2) to collect feedback. The responses from the usability testing of the app can be found in the **usability-tests** folder in the main directory. There are two versions of the same file in two different formats: CSV file **usability-testing-results.csv** and Excel file **usability-testing-results.xlsx**. All 3 responses are contained in both files.

* The backup Firebase database JSON file used to reset the database if needed can be found in **src/assets/data/firebase-template.json**