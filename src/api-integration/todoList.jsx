import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('https://todo.omsent.in/api/tasks');
                console.log(res);
                setTasks(res.data);
            } catch (error) {
                console.error('There was an error fetching the tasks!', error);
            }
        };

        fetchTasks();
    }, []);

    const addTask = async (values, { resetForm }) => {
        try {
            const res = await axios.post('https://todo.omsent.in/api/tasks', values);
            setTasks([...tasks, res.data]);
            resetForm();
        } catch (error) {
            console.error('There was an error adding the task!', error);
        }
    };

    const validationSchema = Yup.object({
        task: Yup.string()
            .required('Task is required')
            .max(50, 'Task cannot be longer than 50 characters'),
    });

    return (
        <div>
            <h1 className=''>Todo List</h1>
            <table className="table table-success table-bordered table-hover  h-50">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Task</th>
                        <th>Completed</th>
                        <th>CreatedDate</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        tasks.map(obj =>
                            <tr key={obj.id}><td>{obj.id}</td><td>{obj.title}</td><td>{obj.task}</td><td>{(obj.completed === true) ? "True" : "False"}</td><td>{obj.createdDate}</td>
                                

                            </tr>
                        )

                    }
                </tbody>
            </table>

            <Formik
                initialValues={{ task: '' }}
                validationSchema={validationSchema}
                onSubmit={addTask}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="task">New Task</label>
                            <Field type="text" name="task" />
                            <ErrorMessage name="task" component="div" />
                        </div>
                        <button type="submit" disabled={isSubmitting}>Add Task</button>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default TodoList;
