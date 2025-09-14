import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TodoList({ session }) {
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState('');

	// Supabase에서 할 일 목록을 가져오는 함수
	const fetchTodos = async () => {
		const { data, error } = await supabase
			.from('todos')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) console.error('Error fetching todos:', error.message);
		else setTodos(data);
	};

	// 컴포넌트가 처음 마운트될 때만 할 일 목록을 불러옵니다.
	useEffect(() => {
		fetchTodos();
	}, []);

	const addTodo = async (e) => {
		e.preventDefault();
		if (!newTask.trim()) return;

		const { error } = await supabase.from('todos').insert({
			task: newTask,
			user_id: session.user.id,
			creator_name: session.user.user_metadata.full_name,
			creator_avatar_url: session.user.user_metadata.avatar_url,
		});

		if (error) {
			console.error('Error adding todo:', error.message);
		} else {
			setNewTask('');
			// ★ 해결: 작업이 끝나면 목록을 새로고침합니다.
			await fetchTodos();
		}
	};

	const toggleTodo = async (id, is_complete) => {
		const { error } = await supabase
			.from('todos')
			.update({ is_complete: !is_complete })
			.eq('id', id)
			.eq('user_id', session.user.id);

		if (error) {
			console.error('Error toggling todo:', error.message);
		} else {
			// ★ 해결: 작업이 끝나면 목록을 새로고침합니다.
			await fetchTodos();
		}
	};

	const deleteTodo = async (id) => {
		const { error } = await supabase
			.from('todos')
			.delete()
			.eq('id', id)
			.eq('user_id', session.user.id);

		if (error) {
			console.error('Error deleting todo:', error.message);
		} else {
			// ★ 해결: 작업이 끝나면 목록을 새로고침합니다.
			await fetchTodos();
		}
	};

	return (
		<div className="todo-container">
			<form className="todo-form" onSubmit={addTodo}>
				<input
					type="text"
					placeholder="공유할 새로운 할 일을 입력하세요..."
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
				/>
				<button type="submit">추가</button>
			</form>
			<ul className="todo-list">
				{todos.map((todo) => (
					<li key={todo.id} className="todo-item">
						<img
							src={todo.creator_avatar_url}
							alt={todo.creator_name}
							className="user-avatar small"
						/>
						<input
							type="checkbox"
							checked={todo.is_complete}
							onChange={() => toggleTodo(todo.id, todo.is_complete)}
							disabled={todo.user_id !== session.user.id}
						/>
						<span className={todo.is_complete ? 'completed' : ''}>
							{todo.task}
						</span>
						{todo.user_id === session.user.id && (
							<button className="secondary" onClick={() => deleteTodo(todo.id)}>
								삭제
							</button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
