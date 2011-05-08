package mk.popravi.mobile;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.titanium.util.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public final class PopravimkAppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	public PopravimkAppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
					
					properties.setBool("ti.android.debug", false);
					
					properties.setString("ti.android.google.map.api.key.development", "0ZnKXkWA2dIAu2EM-OV4ZD2lJY3sEWE5TSgjJNg");
					
					properties.setString("ti.deploytype", "development");
	}
	
	public String getId() {
		return "mk.popravi.mobile";
	}
	
	public String getName() {
		return "PopraviMK";
	}
	
	public String getVersion() {
		return "2.0";
	}
	
	public String getPublisher() {
		return "Dalibor Nasevic";
	}
	
	public String getUrl() {
		return "http://dalibornasevic.com";
	}
	
	public String getCopyright() {
		return "2010-2011 by Dalibor Nasevic";
	}
	
	public String getDescription() {
		return "PopraviMK allows people to help in detecting urban problems they have found on public area in Macedonia";
	}
	
	public String getIcon() {
		return "appicon.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "e5e230d4-dd29-4daf-aa4c-9e7f353ae277";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
