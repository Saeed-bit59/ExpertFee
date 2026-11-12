package ir.expertfee.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;

public final class MainActivity extends Activity {
    private static final String APP_ORIGIN = "https://appassets.androidplatform.net";
    // The web build is copied to the root of the APK's assets directory.
    // Mapping the whole asset tree at "/" preserves Vite's /assets/... URLs.
    private static final String APP_URL = APP_ORIGIN + "/index.html";
    private WebView webView;
    private ProgressBar progressBar;
    private WebViewAssetLoader assetLoader;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(246, 249, 253));
        applyBottomSafeArea(root);
        webView = new WebView(this);
        progressBar = new ProgressBar(this);
        FrameLayout.LayoutParams webParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        );
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(72, 72, Gravity.CENTER);
        root.addView(webView, webParams);
        root.addView(progressBar, progressParams);
        webView.setBackgroundColor(Color.rgb(246, 249, 253));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        assetLoader = new WebViewAssetLoader.Builder()
            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(
                WebView view, WebResourceRequest request
            ) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    view.loadDataWithBaseURL(APP_ORIGIN, offlinePage(), "text/html", "UTF-8", APP_URL);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (APP_ORIGIN.equalsIgnoreCase(uri.getScheme() + "://" + uri.getHost())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });
        setContentView(root);
        if (savedInstanceState == null) webView.loadUrl(APP_URL);
        else webView.restoreState(savedInstanceState);
    }

    @SuppressLint("NewApi")
    private void applyBottomSafeArea(FrameLayout root) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return;
        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View view, WindowInsets windowInsets) {
                Insets bars = windowInsets.getInsets(
                    WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout()
                );
                if (view.getPaddingBottom() != bars.bottom) {
                    view.setPadding(
                        view.getPaddingLeft(),
                        view.getPaddingTop(),
                        view.getPaddingRight(),
                        bars.bottom
                    );
                }
                return windowInsets;
            }
        });
        root.requestApplyInsets();
    }

    private String offlinePage() {
        return "<!doctype html><html dir='rtl'><meta name='viewport' content='width=device-width,initial-scale=1'>"
            + "<body style='font-family:sans-serif;background:#f6f9fd;color:#17345f;text-align:center;padding:64px 24px'>"
            + "<h1>خطای بارگذاری</h1><p>فایل‌های برنامه ExpertFee بارگذاری نشدند.</p>"
            + "<button style='padding:14px 28px;border:0;border-radius:12px;background:#315f9c;color:white;font-size:16px' "
            + "onclick="location.href='" + APP_ORIGIN + "'">تلاش مجدد</button></body></html>";
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
}
