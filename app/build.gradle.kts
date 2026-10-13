plugins {
    id("com.android.application")
}

android {
    namespace = "com.darkdays.chronicles"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.darkdays.chronicles"
        minSdk = 26
        targetSdk = 34
        versionCode = 2
        versionName = "1.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Firma di debug: l'APK release si installa subito. Per il Play Store usa una tua chiave.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
