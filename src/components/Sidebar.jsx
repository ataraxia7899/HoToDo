import React from 'react';
import { supabase } from '../supabaseClient';

// session 정보를 props로 받습니다.
export default function Sidebar({ session }) {
	async function signOut() {
		await supabase.auth.signOut();
	}

	return (
		<nav className="sidebar">
			<div className="sidebar-header">
				<h1 className="sidebar-logo">HoToDo</h1>
			</div>
			<ul className="sidebar-menu">
				{/* 'active' 클래스로 현재 활성화된 메뉴를 표시합니다. */}
				<li className="menu-item active">Tasks</li>
				<li className="menu-item">Dashboard</li>
				<li className="menu-item">Settings</li>
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
