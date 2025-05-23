// routes/taskRoutes.js
const express = require('express');
const { db } = require('../index'); // Adjust path if needed
const { protectRoute } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protectRoute);

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', (req, res, next) => {
  try {
    // Could be all tasks created by user OR assigned to user.
    // For simplicity, let's return tasks created by the user.
    const userTasks = db.tasks.filter(task => task.createdBy === req.user.userId);
    res.json(userTasks);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - Create a new task
router.post('/', (req, res, next) => {
  try {
    const { title, description, dueDate, status, assignedTo } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required for a task.' });
    }
    const newTask = {
      id: `task-${Date.now().toString()}`,
      title,
      description: description || '',
      dueDate: dueDate || null,
      status: status || 'Pending',
      assignedTo: assignedTo || req.user.userId, // Default to self if not provided
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - Get a single task by ID
router.get('/:id', (req, res, next) => {
  try {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    // For tasks, you might allow viewing if createdBy or assignedTo current user
    if (task.createdBy !== req.user.userId && task.assignedTo !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You do not have access to this task.' });
      console.warn(`User ${req.user.userId} accessing task ${task.id} not created by or assigned to them.`);
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', (req, res, next) => {
  try {
    const taskIndex = db.tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found for update.' });
    }
    // Allow update if createdBy or assignedTo current user
    if (db.tasks[taskIndex].createdBy !== req.user.userId && db.tasks[taskIndex].assignedTo !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot update this task.' });
      console.warn(`User ${req.user.userId} attempting to update task ${db.tasks[taskIndex].id} not created by or assigned to them.`);
    }

    const { title, description, dueDate, status, assignedTo } = req.body;
    const updatedTask = { ...db.tasks[taskIndex] };

    if (title) updatedTask.title = title;
    if (description !== undefined) updatedTask.description = description;
    if (dueDate !== undefined) updatedTask.dueDate = dueDate; // Allow setting to null
    if (status) updatedTask.status = status;
    if (assignedTo) updatedTask.assignedTo = assignedTo; // Could be self or another user ID
    updatedTask.updatedAt = new Date().toISOString();

    db.tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', (req, res, next) => {
  try {
    const taskIndex = db.tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found for deletion.' });
    }
    // Allow delete if createdBy or assignedTo current user (or stricter: only createdBy)
    if (db.tasks[taskIndex].createdBy !== req.user.userId && db.tasks[taskIndex].assignedTo !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot delete this task.' });
      console.warn(`User ${req.user.userId} attempting to delete task ${db.tasks[taskIndex].id} not created by or assigned to them.`);
    }
    
    db.tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
