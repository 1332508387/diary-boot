package com.lh.diary.common.vo;

public class PicUploadResult {
	/** 图片上传错误不能抛出，抛出就无法进行jsp页面回调，所以设置这个标识，0表示无异常，1代表异常 */
    private Integer error = 0;
    
    private String url;
    
    private String width;
    
    private String height;

    public Integer getError() {
        return error;
    } 

    public void setError(Integer error) {
        this.error = error;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }
}
