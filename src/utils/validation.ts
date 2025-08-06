// 이메일 유효성 검사
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 비밀번호 유효성 검사 (영문 + 숫자 + 특수문자 포함, 8자 이상)
export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
