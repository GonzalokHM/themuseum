export const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*ç?&#_\-])[A-Za-z\d@$!%*ç?&#_\-]{8,}$/

export const checkPasswordStrength = (password) => {
  let requirements = []
  if (!/(?=.*[a-z])/.test(password))
    requirements.push('Debe incluir una minúscula')
  if (!/(?=.*[A-Z])/.test(password))
    requirements.push('Debe incluir una mayúscula')
  if (!/(?=.*\d)/.test(password)) requirements.push('Debe incluir un número')
  if (!/(?=.*[@$!%*ç?&#_\-])/.test(password))
    requirements.push('Debe incluir un carácter especial')
  if (password.length < 8) requirements.push('Debe tener al menos 8 caracteres')

  let strength = 'Débil'
  if (requirements.length === 0) {
    strength = 'Fuerte'
  } else if (requirements.length <= 2) {
    strength = 'Media'
  }

  return { strength, requirements }
}
