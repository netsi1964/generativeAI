# Running Imagen 4 from the Command Line

This guide details the complete process for setting up a Google Cloud Project to use the Imagen 4 model via the `gcloud` command-line interface. It covers project creation, billing setup, and enabling the necessary APIs.

## Prerequisites

- You have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed on your machine.
- You have a Google Cloud account with a configured billing account.

## Step 1: Authenticate with Google Cloud

The first step is to log into your Google account from the command line.

```bash
gcloud auth login
```

This command opens a browser window for you to sign in. Once complete, your terminal will confirm your logged-in user.

**Your Result:**
```
Your browser has been opened to visit:

    https://accounts.google.com/o/oauth2/auth?response_type=code...

You are now logged in as [netsi1964@gmail.com].
Your current project is [None].  You can change this setting by running:
  $ gcloud config set project PROJECT_ID
```

## Step 2: Create and Configure a New Project

We will create a new, dedicated project for our Imagen work. This keeps things organized and makes it easy to track costs.

### 2.1. Get Your Billing Account ID

A project must be linked to a billing account to enable APIs. First, find your billing account ID. The `beta` command group may need to be installed.

```bash
gcloud beta billing accounts list
```

**Your Result:**
```
ACCOUNT_ID            NAME                OPEN   MASTER_ACCOUNT_ID
0028BB-22A25C-0DB403  My Billing Account  False
```
Your `ACCOUNT_ID` is `0028BB-22A25C-0DB403`.

### 2.2. Create the New Project

Choose a globally unique `PROJECT_ID`. Here, we'll use `netsi-imagen-4`.

```bash
gcloud projects create netsi-imagen-4 --name="Imagen 4 project"
```

**Your Result:**
```
Create in progress for [https://cloudresourcemanager.googleapis.com/v1/projects/netsi-imagen-4].
Waiting for [operations/...] to finish...done.
```

### 2.3. Link Project to Billing Account

Now, link the newly created project to your billing account using the ID from step 2.1.

```bash
gcloud beta billing projects link netsi-imagen-4 --billing-account=0028BB-22A25C-0DB403
```

**Your Result:**
```
billingAccountName: billingAccounts/0028BB-22A25C-0DB403
billingEnabled: false
name: projects/netsi-imagen-4/billingInfo
projectId: netsi-imagen-4
```
> **Note:** `billingEnabled: false` can sometimes appear here. It typically updates to `true` shortly after the first billable API is enabled. This is normal.

## Step 3: Enable the Vertex AI API

To use Imagen, you must enable the Vertex AI API (`aiplatform.googleapis.com`) on your project.

### 3.1. Set the Active Project

Tell `gcloud` to run all subsequent commands on your new project.

```bash
gcloud config set project netsi-imagen-4
```

**Your Result:**
```
Updated property [core/project].
```

### 3.2. Enable the API

This is the final and most crucial step. Use the correct service name to enable the API.

> **Common Pitfall:** A typo in the service name (`aiplatfork.googleapi.com`) will result in a `PERMISSION_DENIED` or `Not found` error.

**The Correct Command:**
```bash
gcloud services enable aiplatform.googleapis.com
```

**Your Result:**
```
Operation "operations/acat.p2-781950343986-0774acb0-94e5-41b6-b4dd-b6737cd04e5b" finished successfully.
```
This success message confirms that the Vertex AI API is now active on the `netsi-imagen-4` project.

## Conclusion

Your Google Cloud environment is now fully configured.

- **Project ID:** `netsi-imagen-4`
- **Enabled API:** Vertex AI (`aiplatform.googleapis.com`)

You can now run your Deno script. Make sure your `.env` file reflects the new Project ID:

**.env file:**
```
GCP_PROJECT_ID="netsi-imagen-4"
GCP_LOCATION="europe-west4"
```