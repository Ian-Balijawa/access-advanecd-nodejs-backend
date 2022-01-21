const { User: UserModel } = require('../models/user.model');

const userController = {};

userController.createUser = (userData) => {
	// user data validation will be done in the req route and
	// then passes to this controller if all is valid
	return new Promise((resolve, reject) => {
		let newUser = new UserModel();
		const { name, email, password, isAdmin } = userData;
		
		newUser = {
			name,
			email,
			password,
			isAdmin,
		};
		UserModel.create(newUser)
			.then((userInstance) => {
				userInstance = userInstance.toObject();
				userInstance.userId = userInstance._id;

				delete userInstance._id;
				delete userInstance._v;

				resolve(userInstance);
			})
			.catch((err) => reject(err));
	});
};

module.exports = userController;
