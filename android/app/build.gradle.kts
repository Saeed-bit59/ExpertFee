plugins { id("com.android.application") }

val storeFilePath = System.getenv("EXPERTFEE_KEYSTORE_PATH")
val storePasswordValue = System.getenv("EXPERTFEE_STORE_PASSWORD")
val keyAliasValue = System.getenv("EXPERTFEE_KEY_ALIAS")
val keyPasswordValue = System.getenv("EXPERTFEE_KEY_PASSWORD")

android {
    namespace = "ir.expertfee.app"
    compileSdk = 36
    defaultConfig {
        applicationId = "ir.expertfee.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        create("release") {
            if (storeFilePath != null) storeFile = file(storeFilePath)
            storePassword = storePasswordValue
            keyAlias = keyAliasValue
            keyPassword = keyPasswordValue
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs.getByName("release")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
