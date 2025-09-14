import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TodoList({ session }) {
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState('');

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		const { data: todos, error } = await supabase
			.from('todos')
			.select('*')
			.eq('user_id', session.user.id)
			.order('created_at', { ascending: false });

		if (error) console.error('Error fetching todos:', error.message);
		else setTodos(todos);
	};

	const addTodo = async (e) => {
		e.preventDefault();
		if (!newTask.trim()) return;

		const { data, error } = await supabase
			.from('todos')
			.insert({ task: newTask, user_id: session.user.id })
			.select();

		if (error) {
			console.error('Error adding todo:', error.message);
		} else if (data) {
			setTodos([data[0], ...todos]);
			setNewTask('');
		}
	};

	const toggleTodo = async (id, is_complete) => {
		const { error } = await supabase
			.from('todos')
			.update({ is_complete: !is_complete })
			.eq('id', id);

		if (error) {
			console.error('Error toggling todo:', error.message);
		} else {
			setTodos(
				todos.map((todo) =>
					todo.id === id ? { ...todo, is_complete: !is_complete } : todo
				)
			);
		}
	};

	const deleteTodo = async (id) => {
		const { error } = await supabase.from('todos').delete().eq('id', id);

		if (error) {
			console.error('Error deleting todo:', error.message);
		} else {
			setTodos(todos.filter((todo) => todo.id !== id));
		}
	};

	return (
		<div className="todo-container">
			<form className="todo-form" onSubmit={addTodo}>
				<input
					type="text"
					placeholder="새로운 할 일을 입력하세요..."
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
				/>
				<button type="submit">추가</button>
			</form>
			<ul className="todo-list">
				{todos.map((todo) => (
					<li key={todo.id} className="todo-item">
						<input
							type="checkbox"
							checked={todo.is_complete}
							onChange={() => toggleTodo(todo.id, todo.is_complete)}
						/>
						<span
							style={{
								textDecoration: todo.is_complete ? 'line-through' : 'none',
							}}
						>
							{todo.task}
						</span>
						<button className="secondary" onClick={() => deleteTodo(todo.id)}>
							삭제
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
