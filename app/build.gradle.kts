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
        versionCode = 8
        versionName = "2.1"
    }

    // Fixed signing key, so every new APK installs over the previous one and keeps the saves.
    // It is committed on purpose (hobby project, see README). For a Play Store release use a
    // private key kept outside the repository.
    signingConfigs {
        create("release") {
            storeFile = file("release.keystore")
            storePassword = "darkdays-chronicles"
            keyAlias = "darkdays"
            keyPassword = "darkdays-chronicles"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
