const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            console.log('Seeding admin user...');
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'adminpassword123', // User can change this later
                role: 'admin'
            });
            console.log('Admin user seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
