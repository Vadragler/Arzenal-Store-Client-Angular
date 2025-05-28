// src/app/dtos/auth-request.dto.ts

export interface UpdateAccountDto {
  Username: string | null | undefined;
  Email: string | null | undefined;
  ActualPassword: string | null | undefined;
  NewPassword: string | null | undefined;
}
