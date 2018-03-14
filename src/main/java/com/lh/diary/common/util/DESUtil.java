package com.lh.diary.common.util;

import org.springframework.util.Base64Utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.security.InvalidAlgorithmParameterException;
import java.security.Key;
import java.security.spec.AlgorithmParameterSpec;

/**
 * 加密解密工具包
 */
public class DESUtil { 

	public static final String ALGORITHM_DES = "DES/CBC/PKCS5Padding";
	
    /**
     * DES算法，加密
     *
     * @param data 待加密字符串
     * @param key  加密私钥，长度不能够小于8位
     * @return 加密后的字节数组，一般结合Base64编码使用
     * @throws InvalidAlgorithmParameterException 
     * @throws Exception 
     */
    public static String encode(String key,String data) {
    	if(data == null)
    		return null;
    	try{
	    	DESKeySpec dks = new DESKeySpec(key.getBytes());	    	
	    	SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
	        //key的长度不能够小于8位字节
	        Key secretKey = keyFactory.generateSecret(dks);
	        Cipher cipher = Cipher.getInstance(ALGORITHM_DES);
	        IvParameterSpec iv = new IvParameterSpec("12345678".getBytes());
	        AlgorithmParameterSpec paramSpec = iv;
	        cipher.init(Cipher.ENCRYPT_MODE, secretKey,paramSpec);           
	        byte[] bytes = cipher.doFinal(data.getBytes());            
	        return byte2hex(bytes);
    	}catch(Exception e){
    		e.printStackTrace();
    		return data;
    	}
    }

    /**
     * DES算法，解密
     *
     * @param data 待解密字符串
     * @param key  解密私钥，长度不能够小于8位
     * @return 解密后的字节数组
     * @throws Exception 异常
     */
    public static String decode(String key,String data) {
    	if(data == null)
    		return null;
        try {
	    	DESKeySpec dks = new DESKeySpec(key.getBytes());
	    	SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
            //key的长度不能够小于8位字节
            Key secretKey = keyFactory.generateSecret(dks);
            Cipher cipher = Cipher.getInstance(ALGORITHM_DES);
            IvParameterSpec iv = new IvParameterSpec("12345678".getBytes());
            AlgorithmParameterSpec paramSpec = iv;
            cipher.init(Cipher.DECRYPT_MODE, secretKey, paramSpec);
            return new String(cipher.doFinal(hex2byte(data.getBytes())));
        } catch (Exception e){
    		e.printStackTrace();
    		return data;
        }
    }

	/**
	 * 二行制转字符串
	 * @param b
	 * @return
	 */
    private static String byte2hex(byte[] b) {
		StringBuilder hs = new StringBuilder();
		String stmp;
		for (int n = 0; b!=null && n < b.length; n++) {
			stmp = Integer.toHexString(b[n] & 0XFF);
			if (stmp.length() == 1)
				hs.append('0');
			hs.append(stmp);
		}
		return hs.toString().toUpperCase();
	}
    
    private static byte[] hex2byte(byte[] b) {
        if((b.length%2)!=0)
            throw new IllegalArgumentException();
		byte[] b2 = new byte[b.length/2];
		for (int n = 0; n < b.length; n+=2) {
		    String item = new String(b,n,2);
		    b2[n/2] = (byte)Integer.parseInt(item,16);
		}
        return b2;
    }
    
    public static void main(String[] args) {
		String encode = DESUtil.encode("asdfghjk", "PHA+Cgk8c3BhbiBzdHlsZT0iZm9udC1zaXplOjE4cHg7Ij4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDvku4rlpKnlhaXogYzvvIzlvojml6nlsLHliLDkuobvvIzlnKjmpbzkuIvnrYnkuoblpb3plb/ml7bpl7TvvIzlh4bml7blnKggOSDngrnliLDovr7lip7lhazlnLDngrnvvIzop4HliLDkuobliJjmgLvvvIzliIbphY3kuobkuIDkuKrlvojljaHnmoTnlLXohJHjgILlronpnZnnmoTlnZDkuobkuIDlpKnvvIzlvojml6DogYrjgII8L3NwYW4+CjwvcD4KPHA+Cgk8c3BhbiBzdHlsZT0iZm9udC1zaXplOjE4cHg7Ij4mbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDvlhazlj7jkurrlvojlsJHvvIzkuInkuKrlgZogSmF2YSDnmoTvvIzkuIDkuKogQyMg55qE77yM5LiA5Liq6L+Q57u077yM6L+Y5pyJ5LiA5Liq6L+Q57u077yM5oiR5bem6L6555qE5Y+v6IO95piv5YGa5YmN56uv55qE77yM6L+Y5pyJ5LiA5Liq6ICB5oC777yM6YO95Zyo5LiA6Ze05bGL5a2Q6YeM44CCPC9zcGFuPgo8L3A+CjxwPgoJPHNwYW4gc3R5bGU9ImZvbnQtc2l6ZToxOHB4OyI+Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A76L+Z5piv5oiR55qE56ys5LiA5Lu95bel5L2c77yM5om+5bel5L2c6L+H56iL5b6I6aG65Yip77yM6Z2i6K+V5LqG5LiJ5a626YO96L+H5LqG77yM6YCJ5oup5LqG5p2l6L+Z77yM5b6I5oOz5YGa5aW95q+P5Lu25LqL77yM6aG65Yip5a6M5oiQ5q+P5Liq5Lu75Yqh44CCPC9zcGFuPgo8L3A+CjxwPgoJPHNwYW4gc3R5bGU9ImZvbnQtc2l6ZToxOHB4OyI+PGJyIC8+Cjwvc3Bhbj4KPC9wPg==");
		String base = Base64Utils.encodeToString(encode.getBytes());
		System.err.println(base);
	}
}