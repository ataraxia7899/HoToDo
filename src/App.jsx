import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import TodoList from './components/TodoList'; // TodoList 컴포넌트를 임포트합니다.
import './App.css';

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
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

	async function signOut() {
		await supabase.auth.signOut();
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>HoToDo</h1>
				{!session ? (
					<button onClick={signInWithDiscord}>Discord로 로그인</button>
				) : (
					<div>
						<p>{session.user.email}님, 환영합니다!</p>
						<button onClick={signOut}>로그아웃</button>
						{/* 로그인된 경우 TodoList 컴포넌트를 렌더링합니다. */}
						{/* session 객체를 props로 넘겨줍니다. */}
						<TodoList key={session.user.id} session={session} />
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
