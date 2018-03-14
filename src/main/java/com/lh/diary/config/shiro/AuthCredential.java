package com.lh.diary.config.shiro;

import com.lh.diary.common.util.MD5Util;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;


public class AuthCredential extends SimpleCredentialsMatcher{
	
	@Override
	public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
		// 获取令牌
		UsernamePasswordToken loginToken = (UsernamePasswordToken) token;
		
		// 获取用户提交的密码
		String password = new String(loginToken.getPassword()); 
		
		// 对密码进行加密操作
		String md5Password = MD5Util.md5(password);
		System.out.println("pass:" + password + " md5:" + md5Password);
		// 将加密处理的用户提交的密码重新设置到令牌中
		loginToken.setPassword(md5Password.toCharArray());
		
		/*
		 * loginToken 中的密码是用户提交的
		 * info 中的密码是通过用户名从数据中查询出来的真实的密码
		 */
		return super.doCredentialsMatch(loginToken, info);
	}
}
