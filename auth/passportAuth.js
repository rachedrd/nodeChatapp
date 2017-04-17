module.exports = function(passport, facebookStrategy, config, mongoose)
{
	var chatUser = new mongoose.Schema({
		profileID: String,
		fullname: String,
		profilePIc: String
		});
	
	var userModel = mongoose.model('chatUser', chatUser);
	/*passport.serializeUser(function(user, done){
		

		done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		console.log("deserializeUser");
		userModel.findById(id, function(err, user){
			if(err){
				console.log('deserializeUser error ...');
				console.log(err);
			}
			done(err, user);
		})
		
	});*/
	passport.use(new facebookStrategy({
		clientID: config.facebook.appID,
		clientSecret: config.facebook.appSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: ['id', 'displayName', 'photos', 'email']
		 //passReqToCallback: true
	}, function(accessToken, refreshToken, profile, done){
		//console.log(profile);
		userModel.findOne({'profileID': profile.id }, function(err, user){
			if(user){
				return done(null, user)
			}
			else
			{
				var newchatUser = new userModel({
					profileID: profile.id,
					fullname: profile.displayName,
					profilePIc: profile.photos[0].value
				});
				newchatUser.save(function(err){
					if(err){
						console.log("the is saving error \n");
					}
					console.log('return newchatUser');
					return done(null, newchatUser);
				})
			}
		})
	}))
	passport.serializeUser(function(user, callback){
		callback(null, user.id)
	});
	passport.deserializeUser(function(id, callback){
		userModel.findById(id, function(err, user){
			callback(null, user);
		});
	});
}