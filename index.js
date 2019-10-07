const SlackBot = require('slackbots');
const config = require('./config.json');

const listJS = require('./listJS');
const listPHP = require('./listPHP');

const bot = new SlackBot({
  token: config.token,
  name: 'Who\'s Deleguate'
});

//If error on start
bot.on('error', (err) => console.log(err));

//Message
bot.on('message', (data) => {
  if(data.type !== 'message') {
    return;
  }

  handleMessage(data.text);
});

//Respons to Data
function handleMessage(message) {
  if (message.includes('!deleguate')) {
    displayDeleguates(Number(new Date().getWeekNumber()));
  }
}

//Get the current week
Date.prototype.getWeekNumber = function(){
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};

//Get index of actual week
function displayDeleguates(week) {
  let getIndex = () => {
    for(let i = 0; i < listJS.list.length; i++) {
      if (listJS.list[i].week === week) {
        return i;
      }
    }
  }

  //Display list of Deleguates
  let index = getIndex();
  bot.postMessageToChannel(
    'général', //Change if you need to post in an other channel
    `Semaine ${week} : Les délégués de cette semaine sont ${listJS.list[index].deleguates} pour les JavaScript ainsi que ${listPHP.list[index].deleguates} pour les PHP !`
  )
}