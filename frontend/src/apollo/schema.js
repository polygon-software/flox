import gql from 'graphql-tag';
// eslint-disable-next-line import/prefer-default-export
export const schema = gql`
  type AccessControlledEntity {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Marks this object as publicly readable
    """
    publicReadAccess: Boolean!

    """
    Marks this object as readable for all logged in users
    """
    loggedInReadAccess: Boolean!

    """
    Owner of this object, has full control over it
    """
    owner: User!
  }

  """
  A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
  """
  scalar DateTime

  type UserGroup {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Username
    """
    name: String!

    """
    Users belonging to this user group
    """
    users: [User!]!

    """
    Resources this user group has read access to
    """
    readAccess: AccessControlledEntity!

    """
    Resources this user group has write access to
    """
    writeAccess: AccessControlledEntity!
  }

  type User {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Username
    """
    username: String!

    """
    Preferred language of user
    """
    lang: String!

    """
    E-mail address
    """
    email: String!

    """
    Cognito UUID
    """
    cognitoUuid: String!

    """
    User role
    """
    role: String

    """
    User enabled or not
    """
    enabled: Boolean

    """
    User groups this user belongs to
    """
    groups: [UserGroup!]!
  }

  type Message {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Language of message
    """
    lang: String!

    """
    Title of message
    """
    title: String!

    """
    Content of message
    """
    content: String!

    """
    Link to which the user is lead on click of the notification
    """
    link: String

    """
    Notification on which this message appears
    """
    notification: Notification!
  }

  type Notification {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Recipient of the notification
    """
    recipient: User!

    """
    Whether the recipient has seen the notification
    """
    read: Boolean!

    """
    Messages in different languages related to this notification
    """
    messages: [Message!]!
  }

  type UserGroupSearchOutput {
    """
    How many items are found within database
    """
    count: String!

    """
    User Groups that fit query
    """
    data: [UserGroup!]!
  }

  type S3File {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Marks this object as publicly readable
    """
    publicReadAccess: Boolean!

    """
    Marks this object as readable for all logged in users
    """
    loggedInReadAccess: Boolean!

    """
    Owner of this object, has full control over it
    """
    owner: User!

    """
    Pre-signed download URL
    """
    url: String

    """
    Files mime type
    """
    mimetype: String!

    """
    Name of File
    """
    filename: String

    """
    Path that leads to file
    """
    path: String

    """
    Filesize in bytes
    """
    size: Float!

    """
    Signed URL to upload object. Only works 1 time
    """
    signedUrl: String
  }

  type FolderOutput {
    """
    Name of the folder
    """
    uuid: ID!

    """
    Name of the folder
    """
    name: String!

    """
    Number of files
    """
    files: Float!

    """
    Summed of size of all files in folder, in bytes
    """
    size: Float!

    """
    Creation date of oldest file in folder
    """
    createdAt: DateTime!

    """
    Last modification of any file in folder
    """
    updatedAt: DateTime
  }

  type FileSearchOutput {
    """
    How many items are found within database
    """
    count: String!

    """
    Files that fit query
    """
    data: [S3File!]!
  }

  type BoundingBox {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Bounding-Box width in percentage of image width
    """
    width: Float!

    """
    Bounding-Box height in percentage of image height
    """
    height: Float!

    """
    Bounding-Box position from the left side of the image, in percentage
    """
    left: Float!

    """
    Bounding-Box position from the top side of the image, in percentage
    """
    top: Float!

    """
    Label to which the bounding box belongs
    """
    label: Label!
  }

  type Label {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Image on which this label was detected
    """
    image: Image!

    """
    Label Name
    """
    name: String!

    """
    Confidence between 0 and 100
    """
    confidence: Float!

    """
    Parent labels
    """
    parents: [String!]!

    """
    Bounding box for every instance of this label on image
    """
    boundingBox: BoundingBox!
  }

  type Image {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Marks this object as publicly readable
    """
    publicReadAccess: Boolean!

    """
    Marks this object as readable for all logged in users
    """
    loggedInReadAccess: Boolean!

    """
    Owner of this object, has full control over it
    """
    owner: User!

    """
    File
    """
    file: S3File!

    """
    Image Width in Pixels
    """
    width: Float

    """
    Image Height in Pixels
    """
    height: Float

    """
    GPS Latitude
    """
    latitude: Float

    """
    GPS Longitude
    """
    longitude: Float

    """
    Capture Date
    """
    capturedAt: DateTime

    """
    Labels of detected objects on image
    """
    labels: [Label!]!
  }

  type ImageSearchOutput {
    """
    How many items are found within database
    """
    count: String!

    """
    Image that fit query
    """
    data: [Image!]!
  }

  type Payment {
    """
    UUID
    """
    uuid: ID!

    """
    Creation date
    """
    createdAt: DateTime!

    """
    Last modification date
    """
    updatedAt: DateTime

    """
    Date of deletion
    """
    deletedAt: DateTime

    """
    Stripe payment intent client secret
    """
    secret: String!

    """
    Stripe payment id
    """
    intentId: String!

    """
    Payment status
    """
    status: String!

    """
    Whether the payment is completed
    """
    paid: Boolean!

    """
    Description of purchase
    """
    description: String!

    """
    Amount paid in this transaction
    """
    amount: Float!

    """
    transaction currency
    """
    currency: String!

    """
    Author of this article
    """
    buyer: User!
  }

  type PaymentIntentOutput {
    """
    UUID
    """
    uuid: ID!

    """
    Description of purchase
    """
    description: String!

    """
    Stripe payment intent client secret
    """
    secret: String!

    """
    Payment status
    """
    status: String!

    """
    Amount paid in this transaction
    """
    amount: Float!

    """
    transaction currency
    """
    currency: String!
  }

  type PaymentSearchOutput {
    """
    How many items are found within database
    """
    count: String!

    """
    Payments that fit query
    """
    data: [Payment!]!
  }

  type UserSearchOutput {
    """
    How many items are found within database
    """
    count: String!

    """
    Users that fit query
    """
    data: [User!]!
  }

  type AdminCreateUserOutput {
    """
    Created user
    """
    data: User!

    """
    password
    """
    password: String
  }

  type Query {
    UserGroup(uuid: ID!): UserGroup!
    UserGroupsOfUser(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      User UUID
      """
      userUuid: ID!
    ): [UserGroup!]!
    MyUserGroups(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0
    ): [UserGroup!]!
    UserGroups(uuids: [ID!] = []): [UserGroup!]!
    AllUserGroups(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0
    ): [UserGroup!]!
    SearchUserGroups(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]
    ): UserGroupSearchOutput!
    FileReadAccessUserGroups(uuid: ID!): [UserGroup!]!
    FileWriteAccessUserGroups(uuid: ID!): [UserGroup!]!
    File(
      uuid: ID!

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): S3File!
    Files(
      uuids: [ID!] = []

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [S3File!]!
    MyFiles(
      uuids: [ID!] = []

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [S3File!]!
    PublicFiles(
      uuids: [ID!] = []

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [S3File!]!
    AllFiles(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int

      """
      Path in which files must be located
      """
      path: String
    ): [S3File!]!
    Folders(
      """
      Path at start of folder
      """
      path: String!
    ): [FolderOutput!]!
    AllMyFiles(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int

      """
      Path in which files must be located
      """
      path: String
    ): [S3File!]!
    MyFolders(
      """
      Path at start of folder
      """
      path: String!
    ): [FolderOutput!]!
    AllPublicFiles(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int

      """
      Path in which files must be located
      """
      path: String
    ): [S3File!]!
    PublicFolders(
      """
      Path at start of folder
      """
      path: String!
    ): [FolderOutput!]!
    SearchFiles(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): FileSearchOutput!
    SearchPublicFiles(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): FileSearchOutput!
    SearchMyFiles(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): FileSearchOutput!
    SearchAdminFiles(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): FileSearchOutput!
    Image(
      uuid: ID!

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): Image!
    Images(
      uuids: [ID!] = []

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [Image!]!
    MyImages(
      uuids: [ID!] = []

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [Image!]!
    AllImages(
      """
      Number of images to load
      """
      take: Int = 500

      """
      How many images to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [Image!]!
    AllMyImages(
      """
      Number of images to load
      """
      take: Int = 500

      """
      How many images to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): [Image!]!
    ImageForFile(
      file: ID!

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): Image!
    SearchImages(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): ImageSearchOutput!
    SearchMyImages(
      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]

      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      URL expiration duration (in seconds)
      """
      expires: Int
    ): ImageSearchOutput!
    UnreadNotifications: [Notification!]!
    Payment(uuid: ID!): Payment!
    SearchPayments(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]
    ): PaymentSearchOutput!
    MyUser: User!
    User(uuid: ID!, cognitoUuid: ID): User!
    Users(uuids: [ID!] = []): [User!]!
    AllUsers(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0
    ): [User!]!
    SearchUsers(
      """
      Number of items to load
      """
      take: Int = 500

      """
      How many items to skip
      """
      skip: Int = 0

      """
      Search for text within items
      """
      filter: String

      """
      Sort by property
      """
      sortBy: String

      """
      Sort descending
      """
      descending: Boolean = false

      """
      Subset of the module's allowed search keys to search in
      """
      searchKeys: [String!]
    ): UserSearchOutput!
    IsUserEnabled(uuid: ID!, cognitoUuid: ID): Boolean!
  }

  type Mutation {
    CreateUserGroup(createUserGroupInput: CreateUserGroupInput!): UserGroup!
    UpdateUserGroup(updateUserGroupInput: UpdateUserGroupInput!): UserGroup!
    DeleteUserGroup(deleteInput: DeleteInput!): UserGroup!
    AddUserToUserGroup(
      addUserToUserGroupInput: AddUserToUserGroupInput!
    ): UserGroup!
    AddUsersToUserGroup(
      addUsersToUserGroupInput: AddUsersToUserGroupInput!
    ): UserGroup!
    RemoveUserFromUserGroup(
      removeUserFromUserGroupInput: RemoveUserFromUserGroupInput!
    ): UserGroup!
    CreateFile(createFileInput: CreateFileInput!): S3File!
    UpdateFile(updateFileInput: UpdateFileInput!): S3File!
    DeleteFile(deleteInput: DeleteInput!): S3File!
    ManipulateFileAccessUserGroups(
      manipulateAccessGroups: ManipulateAccessGroupsInput!
    ): S3File!
    CreateImage(createImageInput: CreateImageInput!): Image!
    DeleteImage(deleteImageInput: DeleteInput!): Image!
    MarkNotificationAsRead(markAsReadInput: MarkAsReadInput!): Notification!
    NotifyUsers(notifyUsersInput: NotifyUsersInput!): [Notification!]!
    NotifyAllUsers(notifyInput: NotifyInput!): [Notification!]!
    TestPayment: PaymentIntentOutput!
    AdminCreateUser(
      adminCreateUserInput: AdminCreateUserInput!
    ): AdminCreateUserOutput!
    SignupCreateUser(signupCreateUserInput: SignupCreateUserInput!): User!
    UpdateUser(updateUserInput: UpdateUserInput!): User!
    DeleteUser(deleteUserInput: DeleteInput!): User!
    DisableUser(disableUserInput: UpdateInput!): User!
    EnableUser(enableUserInput: UpdateInput!): User!
    ForceUserPasswordChange(forceUserPasswordChangeInput: UpdateInput!): User!
  }

  input CreateUserGroupInput {
    """
    Name of group
    """
    name: String!
    users: [ID!] = []
  }

  input UpdateUserGroupInput {
    uuid: ID!

    """
    Name of group
    """
    name: String!
  }

  input DeleteInput {
    uuid: ID!
  }

  input AddUserToUserGroupInput {
    """
    Uuid of group to which user shall be added
    """
    userGroupUuid: ID!

    """
    Uuid of user that shall be added to group
    """
    userUuid: ID!
  }

  input AddUsersToUserGroupInput {
    """
    Uuid of group to which user shall be added
    """
    userGroupUuid: ID!

    """
    Uuids of users that shall be added to group
    """
    userUuids: [ID!]!
  }

  input RemoveUserFromUserGroupInput {
    """
    Uuid of group to which user shall be added
    """
    userGroupUuid: ID!

    """
    Uuid of user that shall be removed from group
    """
    userUuid: ID!
  }

  input CreateFileInput {
    publicReadAccess: Boolean = false
    loggedInReadAccess: Boolean = false
    readAccess: [ID!] = []
    writeAccess: [ID!] = []

    """
    Name of File
    """
    filename: String!

    """
    Path to file
    """
    path: String!

    """
    File mimetype
    """
    mimetype: String!

    """
    Size of file in bytes
    """
    size: Int!
  }

  input UpdateFileInput {
    uuid: ID!

    """
    Name of File
    """
    filename: String

    """
    Path to file
    """
    path: String!
  }

  input ManipulateAccessGroupsInput {
    uuid: ID!
    addReadAccess: [ID!] = []
    removeReadAccess: [ID!] = []
    addWriteAccess: [ID!] = []
    removeWriteAccess: [ID!] = []
  }

  input CreateImageInput {
    publicReadAccess: Boolean = false
    loggedInReadAccess: Boolean = false
    readAccess: [ID!] = []
    writeAccess: [ID!] = []
    file: ID!
    objectRecognition: Boolean = false
  }

  input MarkAsReadInput {
    """
    Uuid of notification
    """
    uuid: ID!
  }

  input NotifyUsersInput {
    """
    Messages in different languages
    """
    messages: [MessageInput!]!

    """
    Uuids of users that shall receive notifications
    """
    recipients: [ID!]!
  }

  input MessageInput {
    """
    Language of message
    """
    lang: String!

    """
    Title of message
    """
    title: String!

    """
    Content of message
    """
    content: String!

    """
    Link to which the user is lead on click of the notification
    """
    link: String
  }

  input NotifyInput {
    """
    Messages in different languages
    """
    messages: [MessageInput!]!
  }

  input AdminCreateUserInput {
    username: String!
    email: String!
    lang: String
    role: Role!
    deliveryMediums: [DeliveryMediums!]!
    phoneNumber: String
  }

  enum Role {
    USER
    ADMIN
  }

  enum DeliveryMediums {
    CUSTOM_EMAIL
    EMAIL
    SMS
  }

  input SignupCreateUserInput {
    username: String!
    email: String!
    lang: String

    """
    password
    """
    password: String!
  }

  input UpdateUserInput {
    uuid: ID!
    username: String
    lang: String
    email: String
  }

  input UpdateInput {
    uuid: ID!
  }
`;
