plugins { id("com.android.application") }

val webDistDirectory = rootProject.projectDir.parentFile.resolve("dist")
val syncWebAssets = tasks.register<Sync>("syncWebAssets") {
    from(webDistDirectory)
    into(layout.projectDirectory.dir("src/main/assets"))
    doFirst {
        if (!webDistDirectory.isDirectory) {
            throw GradleException("Web assets are missing. Run 'npm run build' before building the APK.")
        }
    }
}
tasks.named("preBuild") { dependsOn(syncWebAssets) }

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
        versionCode = 3
        versionName = "1.0.2"
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

dependencies {
    implementation("androidx.webkit:webkit:1.13.0")
}
