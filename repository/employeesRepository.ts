import { query } from '../db/db.js';

export interface Employee {
  id?: number;
  firstname: string;
  lastname: string;
}

class EmployeeRepository {
  async getAll(): Promise<Employee[]> {
    const result = await query('SELECT * FROM fitapp_employees ORDER BY id ASC');
    return result.rows;
  }

  async getById(id: number): Promise<Employee | null> {
    const result = await query('SELECT * FROM fitapp_employees WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const result = await query(
      'INSERT INTO fitapp_employees (firstname, lastname) VALUES ($1, $2) RETURNING *',
      [employee.firstname, employee.lastname]
    );
    return result.rows[0];
  }

  async update(id: number, employee: Partial<Employee>): Promise<Employee | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (employee.firstname !== undefined) {
      updates.push(`firstname = $${paramIndex}`);
      values.push(employee.firstname);
      paramIndex++;
    }

    if (employee.lastname !== undefined) {
      updates.push(`lastname = $${paramIndex}`);
      values.push(employee.lastname);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    const result = await query(
      `UPDATE fitapp_employees SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows.length ? result.rows[0] : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM fitapp_employees WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export default new EmployeeRepository();
