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

public final class MainActivity extends Activity {
    private static final String APP_ORIGIN = "https://expertfee.saeedradmanesh.workers.dev";
    private WebView webView;
    private ProgressBar progressBar;

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
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    view.loadDataWithBaseURL(APP_ORIGIN, offlinePage(), "text/html", "UTF-8", null);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("expertfee.saeedradmanesh.workers.dev".equalsIgnoreCase(uri.getHost())) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });
        setContentView(root);
        if (savedInstanceState == null) webView.loadUrl(APP_ORIGIN);
        else webView.restoreState(savedInstanceState);
    }

    /**
     * Keeps the web content clear of the system navigation bar (three-button keys or
     * gesture bar) and of the display cutout on devices that display the app
     * edge-to-edge, which is enforced for apps targeting SDK 35+ on Android 15+.
     *
     * The web layer also reserves space with env(safe-area-inset-bottom). Because the
     * WebView is padded here, it no longer intersects the navigation bar, so that CSS
     * value resolves to zero and no double spacing is produced.
     */
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
            + "<h1>اتصال اینترنت برقرار نیست</h1><p>برای استفاده از ExpertFee اتصال خود را بررسی کنید.</p>"
            + "<button style='padding:14px 28px;border:0;border-radius:12px;background:#315f9c;color:white;font-size:16px' "
            + "onclick=\"location.href='" + APP_ORIGIN + "'\">تلاش مجدد</button></body></html>";
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
