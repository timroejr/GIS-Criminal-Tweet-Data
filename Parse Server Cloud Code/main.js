const Files = Parse.Object.extend("files");
const CrimeFiles = Parse.Object.extend("crimeFile");

Parse.Cloud.afterSave("crimeFile", function(request) {
	var json = request.object.get('file');
	Parse.Cloud.httpRequest({ url: json.url() }).then(function(response) {
		var json = JSON.parse(response.text);
		console.log(json.length);
		var Crimes = Parse.Object.extend("crime2");
		for (i = 0; i < json.length; i++) {
			var crime = new Crimes();
			console.log("Crime: " + i);
			var d = new Date(json[i].date);
			crime.set("date", d);
			crime.set("crimeType", json[i].crimeType);
			crime.set("description", json[i].description);
			var point = new Parse.GeoPoint({latitude: parseFloat(json[i].latitude), longitude: parseFloat(json[i].longitude)});
			crime.set("geopoint", point);
			crime.save(null, {
			success: function(obj) {
				console.log(obj.id);
			}, error: function(obj, error) {
			console.log("ERROR " + error.code + error.message);
			}
			});
		}
	});
});

Parse.Cloud.afterSave("files", function(request) {
	console.log(request);	
	var json = request.object.get('file');
	Parse.Cloud.httpRequest({ url: json.url() }).then(function(response) {
  // The file contents are in response.buffer.
  		var t = response.text.replace(/[\r\n]+/g, "\n");
		var data = t.split("\n");
		
  		console.log("Data Length:" + data.length);
  		//var jsonConverted = JSON.parse("[" + response.text + "]");
  		var Tweets = Parse.Object.extend("tweets");
  		//console.log(jsonConverted.length);
  		for (i = 0; i < data.length; i++) {
  			var json = JSON.parse(data[i]);
  			//console.log("dataString: " + data[i]);
  			if (data[i].indexOf("{") == -1) {
  				console.log("Skip Place");
  			} else {
  			var tweet = new Tweets();
			//console.log("tweetId: " + json.id);
			console.log("Text: " + json.text);
			tweet.set("createdAtStr", json.created_at);
			var d = new Date(json.created_at);
			tweet.set("create", d);
			tweet.set("in_reply_to_status_id_str", json.in_reply_to_status_id_str);
			tweet.set("in_reply_to_screen_name", json.in_reply_to_screen_name);
			tweet.set("in_reply_to_user_id_str", json.in_reply_to_user_id_str);
			tweet.set("tweetId", json.id);
			tweet.set("text", json.text);
			tweet.set("in_reply_to_status_id", json.in_reply_to_status_id);
			tweet.set("in_reply_to_user_id", json.in_reply_to_user_id);
			tweet.set("source", json.source);
			tweet.set("tweetIdString", json.id_str);
			tweet.set("truncated", json.truncated);
			if (json.geo == null) {
			
			} else {
				var point = new Parse.GeoPoint({latitude: json.geo.coordinates[0], longitude: json.geo.coordinates[1]});
				tweet.set("coord", point);
			}
			
			/*var p = new Persons();
			
			var u = json.user;
			
			p.set("id", u.id_str);
			p.set("name", u.name);
			p.set("screen_name", u.sceen_name);
			p.set("location", u.location);
			p.set("url", u.url);
			p.set("description", u.description);
			p.set("protected", u.protected);
			p.set("verified", u.verified);
			p.set("followers_count", u.followers_count);
			p.set("friends_count", u.friends_count);
			p.set("listed_count", u.listed_count);
			p.set("favourites_count", u.favourites_count);
			p.set("statuses_count", u.statuses_count);
			//p.save();
			
			var userid;
			p.save(null, {
			success: function(obj) {
				userid = obj.id;
				console.log("User Saved: " + obj.id);
			}, error: function(obj, error){
				console.log("ERROR! " + error.code + error.message);
			}
			});*/
						
			tweet.save(null, {
			success: function(obj) {
				console.log(obj.id);
			}, error: function(obj, error) {
			console.log("ERROR " + error.code + error.message);
			}
			});
  			//console.log("JSON: " + json);
  			//console.log("JSON: " + JSON.stringify(json));
  			//console.log("data" + i);
			
  		}
  		}
	});
	

	
	
	
	/*Parse.Cloud.useMasterKey();    
	const query = Parse.Query(Files);
	query.get(request.object.id).then(function(object) {
		var Tweets = Parse.Object.extend("tweets");
		var tweet = new Tweets();
		console.log(object);
		tweet.set("text", "test");
		tweet.save();
		
	}).catch(function(error) {
		console.error("ERROR: " + error.code + ": " + error.message);
	});*/
});