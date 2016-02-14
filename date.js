Datez = function(dateString) {

                this.dateString = dateString || undefined;

                var self = this,
                    beginning = "^",
                    ending = "$",
                    yearPattern = "[2-9][0-9]{3}",
                    monthPattern = "[0-1][0-9]",

                    dayPattern = "[0-9][0-9]",
                    dateRangePattern = beginning + "\.*,\.*",
                    emptyYearPattern = "[0]{4}",
                    emptyMonthPattern = "[0]{2}",
                    emptyDayPattern = "[0]{2}";

                this.datePatterns = {

                    yyyymmdd: RegExp(beginning + yearPattern + '-'+ monthPattern + '-' + dayPattern),
                    yyyymm: RegExp(beginning + yearPattern + '-'+ monthPattern + '-' + emptyDayPattern),
                    yyyy: RegExp(beginning + yearPattern + '-'+ emptyMonthPattern + '-' + emptyDayPattern),
                    mmdd: RegExp(beginning + emptyYearPattern + '-'+ monthPattern + '-' + dayPattern),
                    mm: RegExp(beginning + emptyYearPattern + '-'+ monthPattern + '-' + emptyDayPattern),
                    dd: RegExp(beginning + emptyYearPattern + '-'+ emptyMonthPattern + '-' + dayPattern),
                    //ranges
                    range: RegExp(dateRangePattern),

                    // unconventional
                    yyyyu: RegExp(beginning + yearPattern),
                    mmddyyyy: RegExp(beginning + monthPattern + '\/' + dayPattern + '\/' + yearPattern),
                    ddmmyyyy: RegExp(beginning + dayPattern + '\/' + monthPattern + '\/' + yearPattern)
                }

                this.detectDateIsRange = function(dateString) {
                    if(dateString.match(self.datePatterns.range)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                this.detectDatePattern = function(dateString) {
                    var result;

                    for(var key in self.datePatterns) {
                        if(dateString.match(self.datePatterns[key])) {
                            result = key;
                            break;
                        }
                    }

                    return result;
                };

                this.parsers = {
                    yyyymmdd: function() {
                        var dateArray = self.dateString.split('-');
                        self.year = dateArray[0];
                        self.month = dateArray[1];
                        self.day = dateArray[2];
                    },
                    yyyymm: function() {
                        var dateArray = self.dateString.split('-');
                        self.year = dateArray[0];
                        self.month = dateArray[1];
                    },
                    yyyy: function() {
                        var dateArray = self.dateString.split('-');
                        self.year = dateArray[0];
                    },
                    mmdd: function() {
                        var dateArray = self.dateString.split('-');
                        self.month = dateArray[1];
                        self.day = dateArray[2];
                    },
                    mm: function() {
                        var dateArray = self.dateString.split('-');
                        self.month = dateArray[1];
                    },

                    // unconventional
                    yyyyu: function() {
                        self.year = self.dateString;
                    },

                    mmddyyyy: function() {
                        var dateArray = self.dateString.split('/');
                        self.month = dateArray[0];
                        self.day = dateArray[1];
                        self.year = dateArray[2];
                    },

                    ddmmyyyy: function() {
                        var dateArray = self.dateString.split('/');
                        self.day = dateArray[0];
                        self.month = dateArray[1];
                        self.year = dateArray[2];
                    }
                }

                this.parseDate = function(dateString) {
                    var dateStringIn = dateString || this.dateString,
                        dateResultArray = [];

                    var dateStringArray = dateStringIn.split(','),
                            dynFunction,
                            dateArray = [];
                    dateArray[0] = new Date(dateStringArray[0]);
                    dateArray[1] = new Date(dateStringArray[1]);

                    if(this.detectDateIsRange(dateStringIn)) {

                        dateResultArray.push(dateArray[0][self.detectDatePattern(dateStringArray[0])]);
                        dateResultArray.push(dateArray[1][self.detectDatePattern(dateStringArray[1])]);
                    } else {
                        dynFunction = self.parsers[self.detectDatePattern(dateStringArray[0])];
                        if(typeof dynFunction === 'function') {
                            dynFunction();
                        }
                    }
                    return self.year, self.month, self.day;
                }

                this.parseDate();
            };
