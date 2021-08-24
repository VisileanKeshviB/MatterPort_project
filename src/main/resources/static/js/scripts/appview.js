
define(['knockout'], function(ko) {
return function appview() {
        var self = this;
  		self.key = ko.observable("3yabaz43gq6nkuyb3mddkfchd");
  		self.params=ko.observable("&help=0&play=1&qs=1&gt=0&hr=0")
  		self.matSpace = ko.observable("https://my.matterport.com/show/?m=");
  		self.matsid=ko.observable("u4HDZ3Z96Y4");
  		self.embedHtml = ko.computed(function() {
		return"<embed src="+self.matSpace()+self.matsid()+self.params()+" width='950' height='630'>";
  });
  };
  });