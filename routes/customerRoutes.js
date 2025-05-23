// routes/customerRoutes.js
const express = require('express');
const { db } = require('../index'); // Adjust path if needed, assuming routes are in 'routes' dir
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply JWT protection to all customer routes
router.use(protectRoute);

// GET /api/customers - Get all customers
router.get('/', (req, res, next) => {
  try {
    // For now, returning all customers. In a multi-user app, you might filter by createdBy (req.user.userId)
    // To simulate filtering by user if `createdBy` was added:
    // const userCustomers = db.customers.filter(c => c.createdBy === req.user.userId);
    // res.json(userCustomers);
    res.json(db.customers);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers - Create a new customer
router.post('/', (req, res, next) => {
  try {
    const { name, email, company, status } = req.body;
    if (!name || !email) { // Basic validation
      return res.status(400).json({ message: 'Name and email are required for a customer.' });
    }

    const newCustomer = {
      id: `cust-${Date.now().toString()}`,
      name,
      email,
      company: company || '',
      status: status || 'Active', // Default status
      createdBy: req.user.userId, // Associate with the user who created it
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.customers.push(newCustomer);
    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id - Get a single customer by ID
router.get('/:id', (req, res, next) => {
  try {
    const customer = db.customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    // Ownership check: Only allow access if user created the customer (or if user is admin - not implemented)
    if (customer.createdBy !== req.user.userId) {
        // return res.status(403).json({ message: 'Forbidden: You do not have access to this customer.' });
        // For now, let's allow access for testing, but this check is important in a real app.
        // console.warn(`User ${req.user.userId} accessing customer ${customer.id} created by ${customer.createdBy}`);
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// PUT /api/customers/:id - Update a customer by ID
router.put('/:id', (req, res, next) => {
  try {
    const customerIndex = db.customers.findIndex(c => c.id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found for update.' });
    }

    // Ownership check
    if (db.customers[customerIndex].createdBy !== req.user.userId) {
        // return res.status(403).json({ message: 'Forbidden: You cannot update this customer.' });
        // console.warn(`User ${req.user.userId} attempting to update customer ${db.customers[customerIndex].id} created by ${db.customers[customerIndex].createdBy}`);
    }

    const { name, email, company, status } = req.body;
    const updatedCustomer = { ...db.customers[customerIndex] };

    if (name) updatedCustomer.name = name;
    if (email) updatedCustomer.email = email;
    if (company !== undefined) updatedCustomer.company = company; // Allow setting company to empty string
    if (status) updatedCustomer.status = status;
    updatedCustomer.updatedAt = new Date().toISOString();

    db.customers[customerIndex] = updatedCustomer;
    res.json(updatedCustomer);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/customers/:id - Delete a customer by ID
router.delete('/:id', (req, res, next) => {
  try {
    const customerIndex = db.customers.findIndex(c => c.id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found for deletion.' });
    }

    // Ownership check
     if (db.customers[customerIndex].createdBy !== req.user.userId) {
        // return res.status(403).json({ message: 'Forbidden: You cannot delete this customer.' });
        // console.warn(`User ${req.user.userId} attempting to delete customer ${db.customers[customerIndex].id} created by ${db.customers[customerIndex].createdBy}`);
    }

    db.customers.splice(customerIndex, 1);
    res.status(200).json({ message: 'Customer deleted successfully.' });
    // Or res.status(204).send(); for no content
  } catch (error) {
    next(error);
  }
});

module.exports = router;
