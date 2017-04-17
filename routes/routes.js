module.exports = function(express, app, passport, config, rooms){
	var router = express.Router();
	router.get('/', function(req, res, next){
		res.render('index', {title: 'welcome to chatCAT'});
					})
	function securePages( req, res, next)
{
 if(req.isAuthenticated())
 {
 	next();
 }
 else {
 	res.redirect('/');
      }
};				
	router.get('/chatrooms' , securePages,  function(req, res, next){
		//console.log(req.user);
		res.render('chatrooms', { title: 'chatrooms', user: req.user, config: config });
											});
router.get('/logout' ,  function(req, res, next){
		req.logout();
		res.redirect('/');
											})
router.get('/room/:id' , securePages,  function(req, res, next){
	var room_name = findTitle(req.params.id);
		res.render('room', {user: req.user, room_number: req.params.id, room_name: room_name, config: config });
											});
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callabck', passport.authenticate('facebook',{
	successRedirect:'/chatrooms',
	failureRedirect:'/'

}));

function findTitle(id)
{

	var n = 0;
	while (n < rooms.length)
	{
		
		if(rooms[n].room_number == id)
		{
			//console.log('rooms id & parms id : \n \n ');
	//console.log(rooms[n].room_number + '===' + id);
			return rooms[n].room_name;
			break;
		}
		else
		{
			n++;
			continue;
		}
	}
}
	router.get('/setcolor', function(req, res, next){
		req.session.favColor = 'red';
		console.log(req.session);
		res.send('setting session color ! ')
											})
	router.get('/getcolor', function(req, res, next){
		console.log(req.session);
		res.send('favourite color ' + (req.session.favColor === undefined ? 'not setted' :req.session.favColor ));
		
											})
	app.use('/', router);
							}