

function HolidayCalculator() {

    this.db;

    this.day;
    this.month;

    this.amount = 0;
    this.taken = 0;
    this.extra = 0;
    this.total = 0;

    // Start the match updates
    this.init = function() {
        this.initdb();
        this.getSettings();
        // this.displayIndex();
    this.addSettingsLink();

    }

    this.initdb = function() {
        try {
            if (window.openDatabase) {
                this.db = openDatabase("HolidayCalculator", "1.0", "Holiday Calculator", 200000);
                this.checkSetup();
            } else {
                alert('Web Databases not supported');
            }
        } catch (e) {
            alert('error occurred during DB init, Web Database supported?');
        }
    }

    this.createTables = function(){
        this.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)",[]);
            tx.executeSql("CREATE TABLE IF NOT EXISTS holidays (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, days INTEGER, start TEXT)",[]);
        });
    }

    this.checkSetup = function() {
        var _this = this;
        try {
            this.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM settings WHERE key = 'holiday-amount'", [], function (tx,result) {
                    if (result.rows.length == 0) {
                        _this.displayWelcome();
                    }
                }, function(tx) {
                    _this.displayWelcome();
                })
            });
        } catch (e) {
            _this.displayWelcome();
        }
    }

    this.displayWelcome = function() {

      var body = document.getElementById("body");
      body.setAttribute("class", "intro");

      var page = document.getElementById("page");

      page.innerHTML = '<section><h2>Welcome to the Holiday Calculator App</h2><p>This mobile phone application allows you to easily keep track of how much annual leave you have taken - and how much you have left to spend.</p><h3>Features</h3><ul><li>Works Offline</li><li>No login required</li><li>Your data is 100% private</li></ul><p>Compatible with the iPhone and Android phones. <a onclick="h.displaySetup(); return false" href="#">Get Started</a></section>';
    }

    this.displayAboutPage = function() {
      var body = document.getElementById("body");
      body.setAttribute("class", "intro");


      var page = document.getElementById("page");
      page.innerHTML = '<section><h2>About the Holiday Calculator</h2><p>This application was made because too many people forget how much annual leave they\'ve got left, and then end up having to use it up quickly at the end of the year. Our app lets you manage your holidays more effectively.</p><h3>Who made this?</h3><p>The app was produced by <a href="http://rattlecentral.com">Rattle</a> in a single day on 7th July 2010. Rattle is a design studio based in Sheffield, UK.</p><p><a href="http://twitter.com/rattlecentral">Follow us on Twitter</a> for updates and news for this app and feel free to <a href="mailto:feedback@holidaycalculatorapp.com">e-mail us your feedback</a></p><p><button onclick="h.displayIndex(); return false;">Return to app</button></p><p class="attribute">Some icons are copyright Yusuke Kamiyamane - these are licensed under a <a href="http://creativecommons.org/licenses/by/3.0/">Creative Commons Attribution 3.0 license</a>.</p></section>';

    }

    this.dateSelect = function(val) {
        var date_select = '<select name="" id="holiday-year-day"';
        for(i=0;i<=31;i++){
            if (i < 10) {
                var date_value = '0' + i;
            } else {
                var date_value = i;
            }
            selected = (val == i) ? "selected = 'true'" : ''
            date_select += '<option '+selected+' value="' + date_value + '">' + i + '</option>';
        }
        date_select += '</select>';
        return date_select;
    }

    this.monthSelect = function(val) {
            months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            month_select = '<select name="" id="holiday-year-month">';
            for (var m = 1; m <= 12; m++) {
              selected = (val == m) ? "selected='true'" : ''
        month_select += '<option ' + selected + ' value="'+m+'">'+months.shift()+'</option>';
            }
      month_select += '</select>';
            return month_select;
    }

    this.getSettings = function() {
        var _this = this;
        this.db.transaction(function (tx) {
            tx.executeSql('SELECT key, value FROM settings', [], function(tx, results) {

                for (var c = 0; c < results.rows.length; c++) {
                    if (results.rows.item(c).key == 'holiday-amount')
                        _this.amount = parseInt(results.rows.item(c).value);
                    if (results.rows.item(c).key == 'holiday-taken')
                        _this.taken = parseInt(results.rows.item(c).value);
                    if (results.rows.item(c).key == 'holiday-extra')
                        _this.extra = parseInt(results.rows.item(c).value);
                    if (results.rows.item(c).key == 'holiday-year-day')
                        _this.day = parseInt(results.rows.item(c).value);
                    if (results.rows.item(c).key == 'holiday-year-month')
                        _this.month = parseInt(results.rows.item(c).value);
                }
                _this.displayIndex();
            });

        });
    }

    this.displaySettings = function() {
      var body = document.getElementById("body");
      body.setAttribute("class", "");

        var date_select = this.dateSelect(this.day);
        var month_select = this.monthSelect(this.month);
        document.getElementById('page').innerHTML = '<section><form id="start" method="post" action="#"><h3>Your settings</h3><div class="holiday-start"><p>When does your holiday year start?</p><p class="other-date">' + date_select + ' ' + month_select + '</p></div><p><label for="holiday-amount">How many days annual leave do you get? <em>Not including any national holidays e.g. Bank Holidays.</em></label><input id="holiday-amount" type="number" min="0" value ="'+this.amount+'"></p><p><label for="holiday-extra">Any extra holidays? <em>e.g. days carried over from last year</em></label><input id="holiday-extra" type="number" min="0" value="'+this.extra+'"></p><p class="action final"><button onclick="h.submitSettings(); return false;">Save</button> <a onclick="h.displayIndex(); return false;" href="#">Cancel</a></p></form></section>';
    }

    this.displaySetup = function() {
      var body = document.getElementById("body");
      body.setAttribute("class", "");

        var date_select = this.dateSelect();
        var month_select = this.monthSelect();
        document.getElementById('page').innerHTML = '<section><form id="start" method="post" action="#"><div class="holiday-start"><p>When does your holiday year start?</p><p class="other-date">' + date_select + ' ' + month_select + '</p></div><p><label for="holiday-amount">How many days leave do you get each year? <em>(Not including any national holidays, e.g. Bank Holidays).</em></label><input id="holiday-amount" type="number" min="0" value="20"></p><p><label for="holiday-extra">Any extra holidays? <em>e.g. days carried over from last year</em></label><input id="holiday-extra" type="number" min="0" value="0"></p><p><label for="holiday-taken">How many days have you already taken this year?</label><input id="holiday-taken" type="number" min="0" value="0"></p><p class="action final"><button onclick="h.submitSetup(); return false;">Continue</button></p></form></section>';
    }

    this.submitSettings = function() {

        var _this = this;
        this.day = parseInt(document.getElementById('holiday-year-day').value);
        this.month = parseInt(document.getElementById('holiday-year-month').value);
        this.amount = parseInt(document.getElementById('holiday-amount').value);
        this.extra = parseInt(document.getElementById('holiday-extra').value);

        this.createTables();

        this.db.transaction(function(tx) {
            tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",[_this.day,'holiday-year-day']);
            tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",[_this.month, 'holiday-year-month']);
            tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",[_this.amount, 'holiday-amount']);
            tx.executeSql("UPDATE settings SET value = ? WHERE key = ?",[_this.extra, 'holiday-extra']);
        });
      this.addSettingsLink();
        this.displayIndex();

    }

    this.submitSetup = function() {

        var _this = this;
        var holiday_year_day = document.getElementById('holiday-year-day').value;
        var holiday_year_month = document.getElementById('holiday-year-month').value;
        var holiday_already_taken = parseInt(document.getElementById('holiday-taken').value);
        this.month = parseInt(holiday_year_month);
        this.day = parseInt(holiday_year_day);
        this.amount = parseInt(document.getElementById('holiday-amount').value);
        this.extra = parseInt(document.getElementById('holiday-extra').value);

        this.createTables();

        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO settings (key,value) VALUES (?, ?)",['holiday-year-day', holiday_year_day]);
            tx.executeSql("INSERT INTO settings (key,value) VALUES (?, ?)",['holiday-year-month', holiday_year_month]);
            tx.executeSql("INSERT INTO settings (key,value) VALUES (?, ?)",['holiday-amount', _this.amount]);
            tx.executeSql("INSERT INTO settings (key,value) VALUES (?, ?)",['holiday-extra', _this.extra]);
            if (holiday_already_taken > 0) {
              // FIXME: set this to today's date.
              var default_date = "2010-07-07";
              tx.executeSql("INSERT INTO holidays (name,days,start) VALUES (?, ?, ?)",["Holiday already taken", holiday_already_taken, default_date]);
            }


        });
      this.addSettingsLink();
        this.displayIndex();

    }

    this.addSettingsLink = function() {

      header = document.getElementById("header");

      settings_link = document.createElement("a");
            settings_link.setAttribute('onclick', 'h.displaySettings()')
      settings_link.innerHTML = "Settings";
      header.appendChild(settings_link);

    }


    this.zeroPad = function(number) {
      if(number < 10) {
        return "0" + number;
      } else {
        return number;
      }
    }

    this.displayIndex = function() {
      var body = document.getElementById("body");
      body.setAttribute("class", "");

        var _this = this;
        var ol = '<table><tfoot><tr><th colspan="2">Total</th><th id="total-holidays"></th></tr></tfoot><tbody id="holidays"></tbody></table>';

        document.getElementById('page').innerHTML = '<section id = "days" class="days"><h2>You have <strong></strong> days left to take this year until <span></span></h2></section><section class="holiday-list"><h3>Your Holidays</h3><div id="add-new"><button class="add-new" onclick="h.addNewHoliday();">Add new</button></div>'+ol+'</section>';

        // Calculate the start date for the current leave year
        var start_date = this.calculateCurrentYearStart(_this.day, _this.month -1);
        // convert to ISO format (for db).
        start_date = this.ISODateString(start_date);
        // Calculate the end date for the current leave year
        var end_date = this.calculateCurrentYearEnd(_this.day, _this.month -1);
        // convert to ISO format (for db).
        end_date = this.ISODateString(end_date);

        this.db.transaction(function (tx) {
            list = '';
            tx.executeSql('SELECT id, start, name, days FROM holidays WHERE start > ? AND start < ? ORDER BY start', [start_date, end_date], function (tx, results) {
                _this.addHolidays(results);
            });
            tx.executeSql('SELECT SUM(days) AS days FROM holidays WHERE start > ? AND start < ?', [start_date, end_date], function(tx, result) {
               result.rows.length > 0 ?  _this.total = parseInt(result.rows.item(0).days) || 0 : _this.total = 0;
               _this.updateDaysTaken();
              _this.updateBigDayLeft();
            });
        });
    }


    this.calculateCurrentYearEnd = function(date, month) {
      // start with current Date.
      var year_end_date = new Date();
      // set Month
      year_end_date.setMonth(month);
      // set Date
      year_end_date.setDate(date);
      // go back a day
      year_end_date.setDate(year_end_date.getDate() - 1);

      var current_date = new Date();

      // If we've already passed the year end, then it should be next year.
      if (year_end_date < current_date) {
        year_end_date.setFullYear(year_end_date.getFullYear() + 1);
      }

      return year_end_date;
    }

    this.calculateCurrentYearStart = function(date, month) {
        // start with current Date.
        var year_end_date = new Date();
        // set Month
        year_end_date.setMonth(month);
        // set Date
        year_end_date.setDate(date);
        // go back a day
        year_end_date.setDate(year_end_date.getDate() - 1);

        var current_date = new Date();

        // If we've date is in the future, minus one year.
        if (year_end_date > current_date) {
          year_end_date.setFullYear(year_end_date.getFullYear() - 1);
        }

        return year_end_date;
    }

    this.ISODateString = function(date) {
      function pad(n){return n<10 ? '0'+n : n}
      return date.getUTCFullYear()+'-'
          + pad(date.getUTCMonth()+1)+'-'
          + pad(date.getUTCDate())
    }

    this.updateDaysTaken = function() {
        total_cell = document.getElementById("total-holidays");
        total_cell.innerHTML = this.total;
    }

    // Work out whether to display red, green or amber based on data.
    this.calculateStatus = function() {

      var current_year_end = this.calculateCurrentYearEnd(this.day, this.month -1);
      var current_date = new Date();

      var days_left = this.calculateDateDiff(current_date, current_year_end);
      var balance = this.amount + this.extra - this.total;
      var status = "";
      if ((balance < 5 && days_left > 30) || (balance > 10 && days_left < 30)) {
        status = "warning";
      } else if ((balance < 10 && days_left > 60) || (balance > 10 && days_left < 60)) {
        status = "care";
      }
      return status
    }

    this.calculateDateDiff = function(start_date, end_date) {

      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24

      // Convert both dates to milliseconds
      var date1_ms = end_date.getTime()
      var date2_ms = start_date.getTime()

      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms)

      // Convert back to days and return
      return Math.ceil(difference_ms/ONE_DAY)
    }

    this.updateBigDayLeft = function() {
        big = document.getElementById("days");
        var balance = this.amount - this.taken + this.extra - this.total;
        big.setAttribute("class", "days " + this.calculateStatus())

        var year_end_date = this.calculateCurrentYearEnd(this.day, (this.month - 1));

        var year_end_date_string = this.dateOrdinal(year_end_date.getDate()) + ' ' + this.monthName(year_end_date.getMonth()+1) + ' ' + year_end_date.getFullYear();
        big.innerHTML = '<h2>You have <strong>' + balance + '</strong> days left to take this year until <span>'+ year_end_date_string + '</span></h2>';
    }

    this.addHolidays = function(results) {
        if (results.rows.length > 0) {
            var table_rows = "";
            var date;
            for (c = 0; c < results.rows.length; c++) {
              date = this.parseISODate(results.rows.item(c).start);
              table_rows += '<tr><td><a onclick="h.deleteHoliday('+ results.rows.item(c).id +'); return false;">Remove</a></td><td>' + results.rows.item(c).name + '<span>' +  this.humanDate(date)  + '</span></td><td>' + results.rows.item(c).days + '</td></tr>';
            }
            document.getElementById('holidays').innerHTML = table_rows;
        }
    }

    this.parseISODate = function(xmlDate) {
      if (!/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}/.test(xmlDate)) {
        throw new RangeError("xmlDate must be in ISO-8601 format YYYY-MM-DD.");
      }

      return new Date(xmlDate.substring(0,4), xmlDate.substring(5,7)-1, xmlDate.substring(8,10));
    }


    this.dateOrdinal = function(number) {
      var ordinal_date = "" + number;
      if(number == 1 || number == 21 || number == 31) {
        ordinal_date += "st";
      } else if(number == 2 || number == 22) {
        ordinal_date += "nd";
      } else if(number == 3 || number == 23) {
        ordinal_date += "rd";
      } else {
        ordinal_date += "th";
      }
      return ordinal_date;
    }

    this.humanDate = function(date) {
      var month =  this.monthName(date.getMonth() + 1);
      var day = this.dateOrdinal(date.getDate());
      return "" + day + " " + month  + " " + date.getFullYear();
    }

    this.monthName = function(month) {
      switch(month) {
        case 1: name = 'January'; break;
        case 2: name = 'February'; break;
        case 3: name = 'March'; break;
        case 4: name = 'April'; break;
        case 5: name = 'May'; break;
        case 6: name = 'June'; break;
        case 7: name = 'July'; break;
        case 8: name = 'August'; break;
        case 9: name = 'September'; break;
        case 10: name = 'October'; break;
        case 11: name = 'November'; break;
        case 12: name = 'December'; break;
        }
        return name;
    }

    this.deleteHoliday = function(id) {
        this.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM holidays WHERE id = ?', [id]);
        });
        this.displayIndex();
    }

    this.addNewHoliday= function() {
        var add_new = document.getElementById("add-new");

        var date_select = '<select name="" id="holiday-start-day"';
        for(i=0;i<=31;i++){
            if (i < 10) {
                var date_value = '0' + i;
            } else {
                var date_value = i;
            }
            date_select += '<option value="' + date_value + '">' + i + '</option>';
        }
        date_select += '</select>';

        var month_select = '<select name="" id="holiday-start-month">';

        month_select += '<option value="01">Jan</option>';
        month_select += '<option value="02">Feb</option>';
        month_select += '<option value="03">Mar</option>';
        month_select += '<option value="04">Apr</option>';
        month_select += '<option value="05">May</option>';
        month_select += '<option value="06">June</option>';
        month_select += '<option value="07">July</option>';
        month_select += '<option value="08">Aug</option>';
        month_select += '<option value="09">Sep</option>';
        month_select += '<option value="10">Oct</option>';
        month_select += '<option value="11">Nov</option>';
        month_select += '<option value="12">Dec</option>';

        month_select += '</select>';

        var year_select = '<select id="holiday-start-year">';

        year_select +=  '<option value="2010">2010</option>';
        year_select +=  '<option value="2011">2011</option>';
        year_select +=  '<option value="2012">2012</option>';
        year_select +=  '<option value="2013">2013</option>';
        year_select +=  '<option value="2014">2014</option>';

        year_select += '</select>';

        add_new.innerHTML = '<form class="add-holiday"><p><label for="holiday-name">What are you doing?</label><input type="text" id="holiday-name"></input></p><p><label for="holiday-start-day">Start date</label>' + date_select + ' ' + month_select + ' ' + year_select + '</p><p><label for="holiday-count">Number of days</label><input type="number" id="holiday-count" min="0"></input></p><p class="action"><button onclick="h.submitHoliday(); return false;">Add</button><a onclick="h.cancelAddNew(); return false;" class="cancel">Cancel</a></p></form>';
    };

    this.cancelAddNew = function() {
        var add_new = document.getElementById("add-new");
        add_new.innerHTML = '<button class="add-new" onclick="h.addNewHoliday();">Add new</button>';
    };

    this.submitHoliday = function() {
        var holiday_name = document.getElementById("holiday-name").value;
        var holiday_start_day = document.getElementById("holiday-start-day").value;
        var holiday_start_month = document.getElementById("holiday-start-month").value;
        var holiday_start_year = document.getElementById("holiday-start-year").value;

        var holiday_count = document.getElementById("holiday-count").value;
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO holidays (name,days,start) VALUES (?, ?, ?)",[holiday_name, holiday_count, holiday_start_year + "-" + holiday_start_month + "-" + holiday_start_day]);
        });
        this.displayIndex();
    };

}
