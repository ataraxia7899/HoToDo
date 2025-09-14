import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// session 정보를 props로 받습니다.
export default function TodoList({ session }) {
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState('');

	useEffect(() => {
		// 컴포넌트가 마운트되면 할 일 목록을 불러옵니다.
		fetchTodos();
	}, []);

	// Supabase에서 할 일 목록을 가져오는 함수
	const fetchTodos = async () => {
		const { data: todos, error } = await supabase
			.from('todos') // 'todos' 테이블에서
			.select('*') // 모든 컬럼을 선택하되
			.eq('user_id', session.user.id) // 현재 로그인한 유저의 user_id와 일치하는 것만
			.order('created_at', { ascending: false }); // 최신순으로 정렬

		if (error) {
			console.error('Error fetching todos:', error.message);
		} else {
			setTodos(todos);
		}
	};

	// 새로운 할 일을 추가하는 함수
	const addTodo = async (e) => {
		e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
		if (!newTask.trim()) return; // 내용이 없으면 추가하지 않음

		const { data, error } = await supabase
			.from('todos')
			.insert({
				task: newTask,
				user_id: session.user.id,
			})
			.select(); // 삽입된 데이터를 반환받음

		if (error) {
			console.error('Error adding todo:', error.message);
		} else if (data) {
			setTodos([data[0], ...todos]); // UI에 즉시 반영
			setNewTask(''); // 입력창 비우기
		}
	};

	// 할 일의 완료 상태를 토글하는 함수
	const toggleTodo = async (id, is_complete) => {
		const { error } = await supabase
			.from('todos')
			.update({ is_complete: !is_complete })
			.eq('id', id);

		if (error) {
			console.error('Error toggling todo:', error.message);
		} else {
			// UI 상태 업데이트
			setTodos(
				todos.map((todo) =>
					todo.id === id ? { ...todo, is_complete: !is_complete } : todo
				)
			);
		}
	};

	// 할 일을 삭제하는 함수
	const deleteTodo = async (id) => {
		const { error } = await supabase.from('todos').delete().eq('id', id);

		if (error) {
			console.error('Error deleting todo:', error.message);
		} else {
			// UI에서 해당 할 일 제거
			setTodos(todos.filter((todo) => todo.id !== id));
		}
	};

	return (
		<div>
			<form onSubmit={addTodo}>
				<input
					type="text"
					placeholder="새로운 할 일을 입력하세요..."
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
				/>
				<button type="submit">추가</button>
			</form>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
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
						<button onClick={() => deleteTodo(todo.id)}>삭제</button>
					</li>
				))}
			</ul>
		</div>
	);
}
