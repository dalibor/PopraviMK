P.time = {
  // Takes the format of "Jan 15, 2007 15:45:00 GMT" and converts it to a relative time
  // Ruby strftime: %b %d, %Y %H:%M:%S GMT
  time_ago_in_words_with_parsing: function (from) {
    var date = new Date; 
    date.setTime(Date.parse(from));
    return this.time_ago_in_words(date);
  },
  
  time_ago_in_words: function (from) {
    return this.distance_of_time_in_words(new Date, from);
  },
 
  distance_of_time_in_words: function (to, from) {
    var distance_in_seconds = ((to - from) / 1000);
    var distance_in_minutes = Math.floor(distance_in_seconds / 60);
 
    if (distance_in_minutes == 0) { return 'пред помалку од минута'; }
    if (distance_in_minutes == 1) { return 'пред минута'; }
    if (distance_in_minutes < 45) { return 'пред ' + distance_in_minutes + ' минути'; }
    if (distance_in_minutes < 90) { return 'пред 1 час'; }
    if (distance_in_minutes < 1440) { return 'пред ' + Math.floor(distance_in_minutes / 60) + ' часа'; }
    if (distance_in_minutes < 2880) { return 'пред 1 ден'; }
    if (distance_in_minutes < 43200) { return 'пред ' + Math.floor(distance_in_minutes / 1440) + ' дена'; }
    if (distance_in_minutes < 86400) { return 'пред 1 месец'; }
    if (distance_in_minutes < 525960) { return 'пред ' + Math.floor(distance_in_minutes / 43200) + ' месеци'; }
    if (distance_in_minutes < 1051199) { return 'пред 1 година'; }

    return 'пред ' + (distance_in_minutes / 525960).floor() + ' години';
  }
};
