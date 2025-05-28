import { MenuProps } from "antd";

export type GlobalState = {
    user?: CurrentUser,
}

export type CurrentUser = User & {
    token: string;
}

export type UserLogin = {
    username: string;
    password: string;
}

type UserBase = {
    username: string;
    email: string;
    name: string;
    surname: string;
    dateOfBirth: Date;
    gender: 'M' | 'F';
}

export type UserRegister = UserBase & {
    password: string;
}

export type User = UserBase & {
    id: number;
    role: UserRole;
    createdProjects?: ProjectDTOResponse[];
    joinedProjects?: ProjectDTOResponse[];
}

export type UserRole = "USER" | "ADMIN";

export type MenuPropsWithComponent = MenuProps["items"] extends ((infer T)[] | undefined)
    ? ({
        item: T extends null ? { key: string } : T;
        component: React.FC;
        admin?: boolean;
    })[]
    : never;

// Project DTOs
export interface ProjectDTO {
    name: string;
    description?: string;
}

export interface ProjectSummaryDTO {
    id: number;
    name: string;
    description: string;
    createdDate: Date;
}

export interface ProjectDTOResponse {
    id: number;
    name: string;
    description: string;
    createdDate: Date;
    createdBy: UserSummaryDTO;
}

// Task DTOs
export enum TaskEnum {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export interface TaskDTO {
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assignedToId?: number | null;
    projectId: number;
}

export interface TaskDTOResponse {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    createdDate: Date;
    createdBy: UserSummaryDTO;
    assignedTo: UserSummaryDTO | null;
    projectId: number;
}

// User DTOs
export interface UserSummaryDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export interface UserResponseDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    gender: string;
    dateOfBirth: Date;
    role: UserRole;
    createdProjects?: ProjectDTOResponse[];
    joinedProjects?: ProjectDTOResponse[];
}

export interface UserInvitationDTO {
    title: string;
    description: string;
    invitedUser: UserSummaryDTO;
    projectId: number;
}

// WebSocket Types
export interface WebSocketContextType {
    isConnected: boolean;
    lastProjectUpdate: ProjectDTOResponse | null;
    lastTaskUpdate: TaskDTOResponse | null;
    lastInvitationUpdate: UserInvitationResponseDTO | null;
}

export enum UserInvitationEnum {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED'
}

export interface UserInvitationResponseDTO {
    id: number;
    title: string;
    description: string;
    invitedUser: number;
    project: ProjectDTOResponse;
    status: UserInvitationEnum;
}
