
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Helper para verificar si el usuario es admin
const checkIfAdmin = async (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "La función solo puede ser llamada por un usuario autenticado."
    );
  }
  const user = await admin.firestore().collection("usuarios").doc(context.auth.uid).get();
  if (user.data()?.rol !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "La función solo puede ser llamada por un administrador."
    );
  }
};


exports.deleteUser = functions.https.onCall(async (data, context) => {
  await checkIfAdmin(context);

  const uid = data.uid;
  try {
    // Eliminar de Authentication
    await admin.auth().deleteUser(uid);
    
    // Eliminar de la colección 'usuarios' en Firestore
    await admin.firestore().collection("usuarios").doc(uid).delete();
    
    return { success: true, message: `Usuario con UID ${uid} eliminado correctamente.` };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw new functions.https.HttpsError(
      "internal",
      "No se pudo eliminar el usuario.",
      error.message
    );
  }
});


exports.resetPassword = functions.https.onCall(async (data, context) => {
  await checkIfAdmin(context);

  const email = data.email;
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    
    return { success: true, message: `Se ha enviado un correo para restablecer la contraseña a ${email}.` };

  } catch (error) {
    console.error("Error al iniciar reseteo de contraseña:", error);
    throw new functions.https.HttpsError(
      "internal",
      "No se pudo iniciar el proceso de reseteo de contraseña.",
      error.message
    );
  }
});
