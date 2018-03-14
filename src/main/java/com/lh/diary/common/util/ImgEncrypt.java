package com.lh.diary.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class ImgEncrypt {

	private static final int numOfEncAndDec = 0x130732af; // 加密解密秘钥

	private static int dataOfFile = 0; // 文件字节内容

	public static void encFile(File srcFile, File encFile) throws Exception {
		if (!srcFile.exists()) {
			return;
		} 

		if (!encFile.exists()) {
			encFile.createNewFile();
		}
		InputStream fis = new FileInputStream(srcFile);
		OutputStream fos = new FileOutputStream(encFile);

		while ((dataOfFile = fis.read()) > -1) {
			fos.write(dataOfFile ^ numOfEncAndDec);
		}

		fis.close();
		fos.flush();
		fos.close();
	}
	
	public static void encFile(InputStream srcFileInput, File encFile) throws Exception {
		if (!encFile.exists()) {
			encFile.createNewFile();
		}
		
		InputStream fis = srcFileInput;
		OutputStream fos = new FileOutputStream(encFile);
		
		while ((dataOfFile = fis.read()) > -1) {
			fos.write(dataOfFile ^ numOfEncAndDec);
		}
		
		fis.close();
		fos.flush();
		fos.close();
	}

	public static void decFile(File encFile, File decFile) throws Exception {
		if(!encFile.exists()){
			return;
		}
		if(!decFile.exists()){
			decFile.createNewFile();
		}
		InputStream fis  = new FileInputStream(encFile);
		OutputStream fos = new FileOutputStream(decFile);

		while ((dataOfFile = fis.read()) > -1) {
			fos.write(dataOfFile ^ numOfEncAndDec);
		}
		fis.close();
		fos.flush();
		fos.close();
	}
}
