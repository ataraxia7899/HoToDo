import React from 'react';
import { supabase } from '../supabaseClient';

// session, activeView, setActiveView 정보를 props로 받습니다.
export default function Sidebar({ session, activeView, setActiveView }) {
	async function signOut() {
		await supabase.auth.signOut();
	}

	return (
		<nav className="sidebar">
			<div className="sidebar-header">
				<h1 className="sidebar-logo">HoToDo</h1>
			</div>
			<ul className="sidebar-menu">
				<li
					className={`menu-item ${activeView === 'Tasks' ? 'active' : ''}`}
					onClick={() => setActiveView('Tasks')}
				>
					Tasks
				</li>
				<li
					className={`menu-item ${activeView === 'Log' ? 'active' : ''}`}
					onClick={() => setActiveView('Log')}
				>
					Log
				</li>
			</ul>
			<div className="sidebar-footer">
				<div className="user-profile">
					<img
						src={session.user.user_metadata.avatar_url}
						alt="User Avatar"
						className="user-avatar"
					/>
					<span className="user-name">
						{session.user.user_metadata.full_name}
					</span>
				</div>
				<button className="logout-button" onClick={signOut}>
					로그아웃
				</button>
			</div>
		</nav>
	);
}
