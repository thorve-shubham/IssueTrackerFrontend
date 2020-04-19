export class Issue{
    public issueId : string;
    public title : string;
    public description : string;
    public createdOn : Date;
    public assignedTo : string;
    public reporter : string;
    public status : string;
    public attachments : Array<File>;
    public seen:boolean;
}