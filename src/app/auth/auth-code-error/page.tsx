export default function AuthCodeError() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 flex-col">
      <h1 className="text-4xl text-red-600 font-bold mb-4">Erreur d&apos;authentification</h1>
      <p className="text-gray-700 max-w-md text-center">
        Un problème est survenu lors de la vérification de votre lien d&apos;authentification. 
        Veuillez réessayer de vous connecter.
      </p>
      <a href="/login" className="mt-8 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
        Retour à la page de connexion
      </a>
    </div>
  )
}
