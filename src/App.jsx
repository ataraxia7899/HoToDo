import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import Log from './components/Log';
import './App.css';

function App() {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true); // 로딩 상태 추가
	const [activeView, setActiveView] = useState('Tasks');

	useEffect(() => {
		setLoading(true);
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setLoading(false); // 세션 가져온 후 로딩 false로 설정
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setLoading(false); // 여기서도 로딩 상태 처리
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	async function signInWithDiscord() {
		await supabase.auth.signInWithOAuth({ provider: 'discord' });
	}

	// 세션 확인 중 로딩 표시기 표시
	if (loading) {
		return <div>Loading...</div>;
	}

	if (!session) {
		return (
			<div className="login-page">
				<h1>HoToDo</h1>
				<p>호빵맨 할일관리사이트</p>
				<button onClick={signInWithDiscord}>Discord로 로그인</button>
			</div>
		);
	}

	return (
		<div className="app-layout">
			<Sidebar
				session={session}
				activeView={activeView}
				setActiveView={setActiveView}
			/>
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
