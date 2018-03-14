package com.lh.diary.controller;

import com.google.code.kaptcha.Producer;
import com.lh.diary.common.VerifyCodeContant;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * 验证码生成
 */
@RequestMapping("/code")
@Controller
public class KaptchaController {
	@Resource
	private Producer captchaProducer;

	@RequestMapping(value = "/captchaImage")
	public String getKaptchaImage(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setDateHeader("Expires", 0);
		response.setHeader("Cache-Control", "no-cache, must-revalidate");
		response.addHeader("Cache-Control", "post-check=0, pre-check=0");
		response.setHeader("Pragma", "no-cache");
		response.setContentType("image/jpeg");
		String capText = captchaProducer.createText();// 生成验证码字符串
		//Cookie cookie = new Cookie(Constants.KAPTCHA_SESSION_KEY, capText); // 生成cookie
		//cookie.setMaxAge(300); // 300秒生存期
		//response.addCookie(cookie); // 将cookie加入response
		request.getSession().setAttribute("KAPTCHA_VERIFY_CODE", capText);
		BufferedImage bi = captchaProducer.createImage(capText);// 生成验证码图片
		ServletOutputStream out = response.getOutputStream();
		ImageIO.write(bi, "jpg", out);
		try {
			out.flush();
		} finally {
			out.close();
		}
		return null;
	}

	@ResponseBody
	@RequestMapping("/check")
	public Map ajaxCheckVerifyCode(String verifyCode, HttpSession session) {
		Map<String, Boolean> resultMap = new HashMap<>();
		if(StringUtils.isEmpty((verifyCode)) || verifyCode.length() != 4){
			return null;
		}
		String realVerifyCode = (String) session.getAttribute(VerifyCodeContant.KAPTHA_VERIFY_CODE_KEY);
		if(StringUtils.equalsIgnoreCase(verifyCode, realVerifyCode)){
			resultMap.put("valid", true);
			return resultMap;
		}
		resultMap.put("valid", false);
		return  resultMap;
	}

	@SuppressWarnings("unused")
	private String getRandomString(int length) {
		String base = "abcdefghijklmnopqrstuvwxyz0123456789";
		Random random = new Random();
		StringBuilder sb = new StringBuilder(length + 1);
		for (int i = 0; i < length; ++i) {
			int number = random.nextInt(base.length());
			sb.append(base.charAt(number));
		}
		return sb.toString();
	}
}
