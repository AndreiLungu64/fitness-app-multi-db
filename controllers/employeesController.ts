import { Request, Response } from 'express';
import employeeRepository, { Employee } from '../repository/employeesRepository.js';

const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await employeeRepository.getAll();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createNewEmployee = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
      res.status(400).json({ message: 'First and last name are required' });
      return;
    }

    const newEmployee = await employeeRepository.create({ firstname, lastname });
    const employees = await employeeRepository.getAll();
    res.status(201).json(employees);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.body.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    const existingEmployee = await employeeRepository.getById(id);
    if (!existingEmployee) {
      res.status(400).json({ message: `Employee ID ${id} not found` });
      return;
    }

    const updateData: Partial<Employee> = {};
    if (req.body.firstname) updateData.firstname = req.body.firstname;
    if (req.body.lastname) updateData.lastname = req.body.lastname;

    await employeeRepository.update(id, updateData);
    const employees = await employeeRepository.getAll();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.body.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    const existingEmployee = await employeeRepository.getById(id);
    if (!existingEmployee) {
      res.status(400).json({ message: `Employee ID ${id} not found` });
      return;
    }

    await employeeRepository.delete(id);
    const employees = await employeeRepository.getAll();
    res.json(employees);
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    const employee = await employeeRepository.getById(id);
    if (!employee) {
      res.status(400).json({ message: `Employee ID ${req.params.id} not found` });
      return;
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const employeesController = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};

export { employeesController };
