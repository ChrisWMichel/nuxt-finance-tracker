export const useRedirectIfAuthenticated = (url: string = '/') => {
  const user = useSupabaseUser()

watch(user, (newUser) => {
  if (newUser) {
    return navigateTo(url)
  }
}, { immediate: true})

  return {
    user
  }
}
