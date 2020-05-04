export interface GraphQL<Model> {
  data: Data<Model>;
}

interface Data<Model> {
  [key: string]: Model;
}
