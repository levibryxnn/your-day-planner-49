export type CostType = "free" | "confirmed" | "estimated" | "unavailable";

export type PriorityLevel = "required" | "preferred" | "suggested";

export interface TripStop {
  id: string;
  name: string;
  category: string;
  scheduledTime: string;
  duration: string;
  cost: number;
  costType: CostType;
  image: string;
  selectedByUser: boolean;
  priority: PriorityLevel;
  whyInRoute: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  neighborhood?: string;
  departureOffsetMinutes?: number;
  arrivalTime?: string;
}

export interface UserTripConfig {
  destination: string;
  date: string;
  budget: number;
  adults: number;
  children: number;
  startTime: string;
  endTime: string;
  transportMode: "car" | "public_transit" | "walking";
  interests: string[];
}

export interface AddedPlaceDraft {
  id: string;
  name: string;
  category: string;
  cost: number;
  costType: CostType;
  duration: string;
  image: string;
  priority: "required" | "preferred";
  neighborhood: string;
  description: string;
}

export type StepState =
  | "home"
  | "config_group"
  | "config_time"
  | "config_transport"
  | "config_interests"
  | "user_places"
  | "generating"
  | "itinerary"
  | "tour_mode";
