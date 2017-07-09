const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('./models/pet.js');
const bodyParser = require('body-parser');

//This is for deploying on Heroku!
const DBURL = process.env.MONGODB_URI || 'mongodb://localhost/updog';

//This is for Mongod Server to link to our UpDog database.
mongoose.connect(DBURL)


//SHORT CIRCUITING 
//The Idea being as long as one is true it is true.
const port = process.env.PORT || 8080;

//This links it to what the 'user' would see.
app.use(express.static('public'));

//Run this for every request that is sent.
app.use(bodyParser.json());

//This will link them to API Data
router.route('/')
	.get((req, res) => {
		res.send({
			message: 'Get out of here 💩'
		});
	});

//This will link them to Pet API Data
router.route('/pets')
	.get((req, res) => {
	
		//Get all da pets!!!! 😼
		const query = req.query;

		const pet = Pet.find();

		if(query.order_by === 'score'){
			pet.sort({
				// -1 one is hightest to lowest. 1 lowest to highest.
				score: -1
			});
		} 


		pet.exec({}, (err, docs) => {
			//(err !== null) is faster than to just put (err).
			if(err !== null) {
				//This means something bad happened. Send back Error.
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(docs);
		})
	})
	.post((req, res) => {
		const body = req.body;
		const pet = new Pet(body);
		//Passed the new pet info from client to server and now we save.
		pet.save((err, doc) => {
			if(err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(doc);
		});
	});

//This is to update the data!
router.route('/pets/:pet_id')
	.get((req, res) => {
		const params = req.params;
		Pet.findOne({ _id : params.pet_id }, (err, doc) =>{
			if(err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(doc);
		});
	})
	.put((req, res) => {
		Pet.findById(req.params.pet_id, (err, doc) => {
			if(err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			Object.assign(doc, req.body, {score: doc.score += 1});

			doc.save((err, savedDoc) => {
				if(err !== null) {
					res.status(400)
						.send({
							error: err
						});
					return;
				}
				res.status(200)
					.send(savedDoc);
			})
		})
	})
	.delete((req, res) => {
		Pet.findByIdAndRemove(req.params.pet_id, (err, doc) => {
			if(err !== null){
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send({
					success: "You Deleted Me 💀"
				});
		});
	});

	//CRUD Create. Read. Update. Delete.


//This is for any router to link to our API pages.
app.use('/api', router)

app.listen(port);