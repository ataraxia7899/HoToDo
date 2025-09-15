import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import Log from './components/Log'; // Import Log component
import './App.css';

function App() {
	const [session, setSession] = useState(null);
	const [activeView, setActiveView] = useState('Tasks'); // State for active view

	useEffect(() => {
		// 세션 정보 가져오기 및 인증 상태 변경 감지
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	async function signInWithDiscord() {
		await supabase.auth.signInWithOAuth({ provider: 'discord' });
	}

	// 로그인하지 않았을 때 보여줄 화면
	if (!session) {
		return (
			<div className="login-page">
				<h1>HoToDo</h1>
				<p>호빵맨 할일관리사이트</p>
				<button onClick={signInWithDiscord}>Discord로 로그인</button>
			</div>
		);
	}

	// 로그인했을 때 보여줄 화면
	return (
		<div className="app-layout">
			<Sidebar session={session} activeView={activeView} setActiveView={setActiveView} />
			<main className="main-content">
				{activeView === 'Tasks' ? (
					<>
						<h1>My Tasks</h1>
						<TodoList key={session.user.id} session={session} />
					</>
				) : (
					<Log />
				)}
			</main>
		</div>
	);
}

export default App;
