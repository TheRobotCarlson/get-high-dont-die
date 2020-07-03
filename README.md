
## Inspiration 
Medication is tricky. Sometimes it can cure your illnesses and lift your spirits, other times it can cause more problems than it fixes. 

...But why is that? 
Why didn't your doctor tell you about the negative side effects of the pills given to you? How are you supposed to properly weigh your risks? What about medicines your doctor would never mention? Alternate medicines? Illegal drugs? Can you discuss those with your doctor?

Can you even afford a doctor? This is America, after all. 

## What it does
In the Information Age, wouldn't it be nice if you could use your own data for more than just Netflix movie recommendations?

Get High Don't Die is a service that allows users to track their adherence and frequency of drug usage, as well as keep track of any negative side effects they've experienced. By cross referencing the data from the other users and your own records, we can discover new drug interactions and provide increasingly personalized drug recommendations. In addition, our integration with the FDA's adverse drug event reporting system allows us a source of original truth when making recommendations to users.

## How I built it
- Lots of work in Jupyter notebook scraping, cleaning, scraping, cleaning, scraping, cleaning 
- Neo4j for modeling drug interactions in a dynamic and ever-expanding graph!
- Vue for the front end. Python Flask for the backend.

## How to setup / build
1. `pip install -r requirements.txt`
1. Download [Neo4j](https://neo4j.com/) and start it up, launch a graph database
1. get an api key from [openfda](https://open.fda.gov/apis/)
1. start jupyter and run the cells in data_analysis/drug_explore.ipynb - this will upload the data into neo4j (you might have to fiddle with it a bit, this will take forever and timeout often)
1. open `frontend/index.html` in the browser and it should load the vue code to allow you search groups of medications for their interaction levels

## Challenges I ran into
Rate limits are hell. APIs that you're consuming rarely hold to the promises they make in their documentation 

## Accomplishments that I'm proud of
Pagination! I made a wrapper that circumvents illogical restrictions on api access. Turns out the FDA doesn't want you to use more than 25k of their Adverse Drug Events to analyze, despite having ~11 million of them...

## What I learned
I learned how to navigate the FDA's open drug data and a great way to represent drug interactions in a graph database.

## What's next for Get High Don't Die
Smoothing up the frontend, making a mobile app, pushing it all to the cloud!
